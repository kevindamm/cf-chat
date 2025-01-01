// The GameSession represents a Durable Object instance, retrieved by its ID
// from the binding in the worker's environment.

import { DurableObject } from "cloudflare:workers";

type PlayerActions = Map<string, string>;
interface Player {
  name: string;
  observing: boolean;
}

// The actual contents of a game's session, represented as a Durable Object.
export class GameSession extends DurableObject<Env> {
  private contestants: Player[];
  private observers: Player[];

  private history: PlayerActions[]; 

  constructor(readonly state: DurableObjectState, env: Env) {
    super(state, env);
    this.contestants = [];
    this.observers = [];
    this.history = [];
  }
}

type Hand = string;

const SHAKE = [
  "🫱    🫲",
  " 🫱  🫲",
  "  🫱🫲",
  "   🤝",
];

const LEFT = ">" as Hand;
const RIGHT = "<" as Hand;
const ROCK = "R" as Hand;
const PAPER = "P" as Hand;
const SCISSORS = "S" as Hand;

const HandShapes = {
  LEFT: [
    "🤜",
    "🤜🏻",
    "🤜🏼",
    "🤜🏽",
    "🤜🏾",
    "🤜🏿",
  ],
  RIGHT: [
    "🤛",
    "🤛🏻",
    "🤛🏼",
    "🤛🏽",
    "🤛🏾",
    "🤛🏿",
  ],
  ROCK: [
    "✊",
    "✊🏻",
    "✊🏼",
    "✊🏽",
    "✊🏾",
    "✊🏿",
  ],
  PAPER: [
    "🖐️",
    "🖐🏻",
    "🖐🏼",
    "🖐🏽",
    "🖐🏾",
    "🖐🏿",
  ],
  SCISSORS: [
    "✌️",
    "✌🏻",
    "✌🏼",
    "✌🏽",
    "✌🏾",
    "✌🏿",
  ],
};

class Player {
  public name: string;
  private _hand: Hand;

  constructor(name: string, challenger: boolean) {
    this.name = name;
    this._hand = ">";
    if (challenger) {
      this._hand = "<";
    }
  }

  public set hand(hand: Hand) {
    if (hand === ROCK ||
        hand === PAPER ||
        hand === SCISSORS) {
      this._hand = hand;
    } else {
      throw new Error('hand value ' + hand + ' is invalid.');
    }
  }
}