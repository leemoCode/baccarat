<template>
    <div v-for="(line, index) in resultLines" :key="index" class="line">
        <span v-for="(result, idx) in line" :key="idx" :class="generateClass(result)">
            {{ result.lucky6 === 1 ? '6' : '' }}
        </span>
    </div>
</template>

<script>
export default {
    props: {
        games: {
            type: Array,
            required: true
        }
    },
    computed: {
        resultLines() {
            const lines = [];
            let currentLine = [];

            this.games.forEach(game => {
                if (currentLine.length === 0 || currentLine[0].res === game.res) {
                    currentLine.push(game);
                } else {
                    lines.push([...currentLine]);
                    currentLine = [game];
                }
            });

            if (currentLine.length > 0) lines.push(currentLine);

            return lines;
        }
    },
    methods: {
        generateClass(result) {
            const classes = ['result-dot', result.res];

            if (result.bankerDuplicate === 1 && result.playerDuplicate === 1) {
                classes.push('both-pair');
            } else if (result.bankerDuplicate === 1) {
                classes.push('banker-pair');
            } else if (result.playerDuplicate === 1) {
                classes.push('player-pair');
            }

            return classes;
        }
    }
};
</script>

<style>

.results-container {
    display: flex;
    flex-direction: column;
    position: fixed;
    width: 100%;
    bottom: 0;
    z-index: -1;
}

.line {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.result-dot {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin: 5px;
    text-align: center;
    line-height: 20px;
    font-size: 12px;
    font-weight: bold;
    color: white;
}

.result-dot.庄 {
    background-color: red;
}

.result-dot.闲 {
    background-color: green;
}

.result-dot.和 {
    background-color: blue;
}

/* 为庄对子添加内部边框 */
.banker-pair {
    box-shadow: inset 0 0 0 2px white, inset 0 0 0 6px red;
}

/* 为闲对子添加内部边框 */
.player-pair {
    box-shadow: inset 0 0 0 2px white, inset 0 0 0 6px green;
}

/* 如果庄和闲都是对子 */
.both-pair {
    box-shadow: inset 0 0 0 2px white, inset 0 0 0 6px yellow;
}
</style>
