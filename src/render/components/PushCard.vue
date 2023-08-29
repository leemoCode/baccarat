<template>
    <div>
        <div>
            {{ roundStatus }}
        </div>

        <el-button @click="getCards">发牌</el-button>
        <el-button @click="openCards">开牌</el-button>


        庄:{{ bankerCards }} {{ bankerScore }}点
        闲:{{ playerCards }} {{ playerScore }}点

        <el-button v-if="playerNeedAddCard" @click="playerAddCard">闲补牌</el-button>
        <el-button v-if="bankerNeedAddCard" @click="bankerAddCard">庄补牌</el-button>

    </div>
</template>
    
<script>
import { ref, onMounted, nextTick, computed, watch } from 'vue';
const { ipcRenderer } = require('electron');

const ROUND_STATUS = {
    PENDING: 0,
    FINISH: 1,
}

export default {
    setup() {
        const roundStatus = ref(ROUND_STATUS.FINISH);

        watch(roundStatus, (newValue, oldValue) => {
            console.log(oldValue, newValue);
            if (oldValue === ROUND_STATUS.PENDING && newValue === ROUND_STATUS.FINISH) {
                // 计算结果
                caclulateResult();
            }
        });

        const currCards = ref([]);
        const bankerCards = ref([]);
        const playerCards = ref([]);

        const bankerNeedAddCard = ref(false);
        const playerNeedAddCard = ref(false);

        // 存储每轮结果
        const resultList = ref([]);

        const bankerScore = computed(() => {
            return calculateCardSum(bankerCards);
        });

        const playerScore = computed(() => {
            return calculateCardSum(playerCards);
        });

        const stopPushCard = computed(() => {
            return bankerScore.value === 8 || bankerScore.value === 9 || playerScore.value === 8 || playerScore.value === 9;
        });

        const getCards = () => {
            // 每次发牌先清空上一轮结果
            currCards.value = [];
            playerCards.value = [];
            bankerCards.value = [];

            for (let i = 0; i <= 3; i++) {
                ipcRenderer.send('GET_CARD');
            }
            roundStatus.value = ROUND_STATUS.PENDING;
        };

        const openCards = () => {
            // 首轮发完后记庄、闲
            playerCards.value.push(currCards.value[0]);
            playerCards.value.push(currCards.value[2]);

            bankerCards.value.push(currCards.value[1]);
            bankerCards.value.push(currCards.value[3]);

            // 判断是否需要补牌
            if (stopPushCard.value) {
                roundStatus.value = ROUND_STATUS.FINISH;

                return;
            }

            // 闲家补牌逻辑判断
            if (playerScore.value < 6) {
                playerNeedAddCard.value = true;
            }
        }

        const bankerAddCard = () => {
            ipcRenderer.send('GET_CARD');

            setTimeout(() => {
                const newCard = currCards.value[currCards.value.length - 1];
                bankerCards.value.push(newCard);
                bankerNeedAddCard.value = false;

                roundStatus.value = ROUND_STATUS.FINISH;

            }, 500);
        };

        const playerAddCard = () => {
            ipcRenderer.send('GET_CARD');

            setTimeout(() => {
                const newCard = currCards.value[currCards.value.length - 1];

                playerCards.value.push(newCard);
                playerNeedAddCard.value = false;

                // 判断庄是否需要补牌
                bankerNeedAddCard.value = checkBankerIfNeedAddCard(newCard);

                if (!bankerNeedAddCard.value) {
                    roundStatus.value = ROUND_STATUS.FINISH;
                }
            }, 500);
        };

        const checkBankerIfNeedAddCard = (thirdCard) => {
            const thirdCardValue = calculateCardSum(ref(thirdCard.split('')));
            // 根据规则判断是否需要补牌
            if (bankerScore.value <= 2) {
                return true;
            } else if (bankerScore.value === 3) {
                if (thirdCardValue !== 8) {
                    return true;
                }
            } else if (bankerScore.value === 4) {
                if (![0, 1, 8, 9].includes(thirdCardValue)) {
                    return true;
                }
            } else if (bankerScore.value === 5) {
                if (![0, 1, 2, 3, 8, 9].includes(thirdCardValue)) {
                    return true;
                }
            } else if (bankerScore.value === 6) {
                if ([6, 7].includes(thirdCardValue)) {
                    return true;
                }
            }

            // 不需要补牌
            return false;
        };

        const caclulateResult = () => {
            const roundResult = {};

            // 记录得分
            roundResult.playerScore = playerScore.value;
            roundResult.bankerScore = bankerScore.value;

            // 记录牌型
            roundResult.playerCards = playerCards.value;
            roundResult.bankerCards = bankerCards.value;

            // 胜负
            roundResult.res = '和';
            if (bankerScore.value > playerScore.value) {
                roundResult.res = '庄';
            }
            if (bankerScore.value < playerScore.value) {
                roundResult.res = '闲';
            }

            // 幸运6
            roundResult.lucky6 = 0;
            if ((roundResult.res === '庄' && bankerScore.value === 6) || (roundResult.res === '闲' || playerScore.value === 6)) {
                roundResult.lucky6 = 1;
            }

            // 对子
            roundResult.bankerDuplicate = 0;
            if (hasDuplicateCards(bankerCards)) {
                roundResult.bankerDuplicate = 1;
            }

            roundResult.playerDuplicate = 0;
            if (hasDuplicateCards(playerCards)) {
                roundResult.playerDuplicate = 1;
            }

            // 存储本轮对局结果
            resultList.value.push(roundResult);
            console.log('结果报表', resultList.value);
            return roundResult;
        };

        const hasDuplicateCards = (arr) => {
            const elementSet = new Set(); // 创建一个 Set 用于存储已经遍历过的元素

            for (const element of arr.value) {
                if (elementSet.has(element)) {
                    // 如果 Set 中已经存在该元素，表示数组中有重复元素
                    return true;
                }
                // 否则，将该元素添加到 Set 中
                elementSet.add(element);
            }

            // 遍历完数组后没有找到重复元素
            return false;
        };

        const calculateCardSum = (cards) => {
            const cardValues = {
                '2': 2,
                '3': 3,
                '4': 4,
                '5': 5,
                '6': 6,
                '7': 7,
                '8': 8,
                '9': 9,
                '10': 10,
                'J': 0,
                'Q': 0,
                'K': 0,
                'A': 1
            };

            // 计算总和
            let sum = 0;
            for (const card of cards.value) {
                sum += cardValues[card] || 0;
            }

            // 当总和大于10时，只保留个位数
            if (sum >= 10) {
                sum = sum % 10;
            }

            return sum;
        };


        onMounted(() => {
            // 监听主进程的响应
            ipcRenderer.on('GET_CARD_RES', (event, data) => {
                currCards.value.push(data);
            });
        });

        // 提供数据和方法给模板
        return {
            roundStatus,

            playerCards,
            bankerCards,
            bankerScore,
            playerScore,
            bankerNeedAddCard,
            playerNeedAddCard,

            getCards,
            openCards,

            playerAddCard,
            bankerAddCard,
        };
    },
};
</script>
  