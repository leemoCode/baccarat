function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateRandomDeck(n) {
    const cards = [];
    const suits = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < n; j++) {
            cards.push(suits[i]);
        }
    }

    shuffleArray(cards);
    return cards;
}

const n = 8 * 4; // 默认八副牌

var currCardList = generateRandomDeck(n);
console.log('当前排序:', currCardList);

function refreshCard() {
    currCardList = generateRandomDeck(n);
    console.log('洗牌结果', currCardList);
}

function pushCard() {
    console.log('发牌', currCardList[0]);
    return {
        card: currCardList.shift(),
        number: currCardList.length,
    };
}

module.exports = {
    currCardList,
    refreshCard,
    pushCard,
};
