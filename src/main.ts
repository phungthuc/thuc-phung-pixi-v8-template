import { Game } from "./core/Game";

window.onload = () => {
    console.log('Window loaded');
    const game = Game.getInstance();
    game.init();
};