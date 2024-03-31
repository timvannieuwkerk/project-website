export default class View {

    $ = {}

    $$ = {}

    constructor() {
        this.$.menu= this.#qs('[data-id="actions"]');
        this.$.menuButton= this.#qs('[data-id="menu-button"]');
        this.$.menuItems= this.#qs('[data-id="menu-items"]');
        this.$.menuReset= this.#qs('[data-id="reset"]');
        this.$.menuNewRound= this.#qs('[data-id="new-round"]');
        this.$.model= this.#qs('[data-id="model"]');
        this.$.modelText= this.#qs('[data-id="model-text"]');
        this.$.modelButton= this.#qs('[data-id="model-button"]');
        this.$.turn= this.#qs('[data-id="turn"]');
        this.$.p1= this.#qs('[data-id="p1"]');
        this.$.ties= this.#qs('[data-id="ties"]');
        this.$.p2= this.#qs('[data-id="p2"]');
        this.$.grid= this.#qs('[data-id="grid"]');

        this.$$.squares= this.#qsAll("[data-id='square']");

        this.$.menuButton.addEventListener('click', event => {
            this.#toggleMenu();
        });
    }

    render(game, stats) {
        const {playerWithStats, ties} = stats;
        const {moves, currentPlayer, status: {isComplete, winner}} = game;
        
        this.#closeAll();
        this.#clearMoves();
        
        this.#updateScoreboard(playerWithStats[0].wins, ties, playerWithStats[1].wins);
        this.#initializeMoves(moves);

        if (isComplete) {
            this.#openModel(winner ? `${winner.name} wins!` : 'Tie!');        
            return;
        }

        this.#setTurnIndicator(currentPlayer);
    }

    // Register all the event listeners

    bindGameResetEvent(handler) {
        this.$.menuReset.addEventListener('click', handler);
        this.$.modelButton.addEventListener('click', handler);
    }

    bindNewRoundEvent(handler) {
        this.$.menuNewRound.addEventListener('click', handler);
    }

    bindPlayerMoveEvent(handler) {
        this.#delegate(this.$.grid, '[data-id="square"]', 'click', handler);
    }

    // DOM helper methods

    #updateScoreboard(p1, ties, p2) {
        this.$.p1.innerText = `${p1} wins`;
        this.$.ties.innerText = `${ties}`;
        this.$.p2.innerText = `${p2} wins`;
    }

    #openModel(message) {
        this.$.model.classList.remove('hidden');
        this.$.modelText.innerText = message;
    }

    #closeModel() {
        this.$.model.classList.add('hidden');
    }

    #closeMenu() {
        this.$.menuItems.classList.add("hidden");
        this.$.menuButton.classList.remove("border");
        
        const icon = this.$.menuButton.querySelector('i');

        icon.classList.add("fa-chevron-down");
        icon.classList.remove("fa-chevron-up");
    }

    #closeAll() {
        this.#closeModel();
        this.#closeMenu();
    }

    #clearMoves() {
        this.$$.squares.forEach(square => square.replaceChildren());
    }

    #toggleMenu() {
        this.$.menuItems.classList.toggle("hidden");
        this.$.menuButton.classList.toggle("border");
        
        const icon = this.$.menuButton.querySelector('i');

        icon.classList.toggle("fa-chevron-down");
        icon.classList.toggle("fa-chevron-up");
    }

    #handlePlayerMove(squareEl, player) {
        const icon = document.createElement('i');
        icon.classList.add('fa-solid', player.iconClass, player.colorClass);

        squareEl.replaceChildren(icon);
    }

    #initializeMoves(moves) {
        this.$$.squares.forEach(square => {
            const existingMove = moves.find(move => move.squareId === +square.id);

            if (existingMove) {
                this.#handlePlayerMove(square, existingMove.player)
            }
        })
    }

    #setTurnIndicator(player) {
        const icon = document.createElement('i');
        const label = document.createElement('p');
        
        icon.classList.add(player.colorClass, 'fa-solid', player.iconClass);

        label.classList.add(player.colorClass);
        label.innerText = `${player.name}, you're up!`;

        this.$.turn.replaceChildren(icon, label);
    }

    #qs(selector, parent) {
        const el = parent ? parent.querySelector(selector) : document.querySelector(selector);

        if (!el) throw new Error('Could not find element');

        return el;
    }

    #qsAll(selector) {
        const elList = document.querySelectorAll(selector);

        if (!elList) throw new Error('Could not find element');

        return elList;
    }

    #delegate(el, selector, eventKey, handler) {
        el.addEventListener(eventKey, (event) => {
            if (event.target.matches(selector)) {
                handler(event.target);
            }
        });
    }
}