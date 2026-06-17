# Mission: Algorithmic Crypto Trading (with Python + Claude Code)

## Why
Learn algorithmic trading from first principles by building a crypto trading bot in Python, using Claude Code as a pair programmer. The goal is genuine understanding of how automated strategies work — data, signals, risk, and execution — not copying a black-box bot. Success means being able to design, backtest, and paper-trade a strategy you actually understand, then graduate to small real-money positions only once it has proven itself.

## Success looks like
- Explain, from memory, the full loop a trading bot runs (data → signal → risk → order → repeat).
- Read live crypto market data from an exchange in Python and compute a simple signal from it.
- Backtest a strategy against historical data and correctly interpret the results (including its flaws).
- Run a strategy in paper-trading (dry-run) mode against live market data with zero capital at risk.
- Articulate the main ways a backtest lies (overfitting, look-ahead bias, ignored fees/slippage) and how to defend against them.
- Only after the above: place a first small real-money trade through code, with hard risk limits in place.

## Constraints
- **New to Python** — language fundamentals must be taught alongside trading concepts, never assumed.
- **Paper-trade and backtest first**; real money only after a strategy is validated. Capital preservation > returns.
- Learner wants to use **Claude Code** as the development environment / pair programmer.
- Crypto markets (24/7, free testnet/paper APIs) chosen as the training ground.

## Out of scope (for now)
- Live real-money trading until backtesting + paper trading are solid.
- High-frequency / low-latency trading, options, futures, and leverage.
- Machine-learning strategies (e.g. FreqAI) — revisit only after a simple rules-based strategy is fully understood.
- Tax, accounting, and regulatory specifics.
