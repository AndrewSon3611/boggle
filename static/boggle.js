class BoggleGame{
    constructor(boardID, secs = 60){
        this.secs = secs;
        this.showTimer();

        this.score = 0;
        this.words = new Set();
        this.board = $('#' + boardID);
        
        this.timer = setInterval(this.cd.bind(this), 10000);

        $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
    }

    showScore(){
        $(".score", this.board).text(this.score);
    }
    showWord(word){
        $(".words", this.board).append($("<li>",{text:word}));
    }

    showMsg(msg, cls){
        $(".msg", this.board).text(msg).removeClass().addClass(`msg${cls}`);
    }

    showTimer(){
        $(".timer", this.board).text(this.secs);
    }

    async cd(){
        this.secs -= 1;
        this.showTimer();

        if (this.secs == 0){
            clearInterval(this.timer);
            await this.scoreGame();
        }
    }

    async handleSubmit(){
        evt.preventDefault();
        const $word = $(".word", this.board);

        let word = $word.val();
        if (!word){
            return
        }
        if (this.words.has(word)){
            this.showMsg(`Already found ${word}`, "error");
            return;
        }

        const respo = await axios.get("/check-word", {params: { word: word}});
        if(respo.data.result === "not-word"){
            this.showMsg(`${word} is not a valid English word`, "error");
        }
        else if(respo.data.result === "not-on-board"){
            this.showMsg(`${word} is not a valid word on this board`, "error");
        }
        else{
            this.showWord(word);
            this.score += word.length;
            this.showScore();
            this.words.add(word);
            this.showMsg(`Added: ${word}`, "OK");
        }

        $word.val("").focus();
        

    }
    async scoreGame(){
        $("add.word", this.board).hide();
        const response = await axios.post("/post-score", { score: this.score});
        if(response.data.brokeRecord){
            this.showMsg(`New Record: ${this.score}`, "OK");
        }
        else{
            this.showMsg(`Final Score: ${this.score}`, "OK")
        }
    }
}