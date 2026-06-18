# Algorithmic Crypto Trading Resources

Curated, high-trust sources for learning algorithmic trading in Python. Knowledge for lessons is drawn from here, not from guesses. Verified June 2026.

## Knowledge

### Python fundamentals (you are new to Python)
- [Automate the Boring Stuff with Python — Al Sweigart (free online, 3rd ed.)](https://automatetheboringstuff.com/)
  The standard no-CS-background intro to Python. Use for: variables, loops, functions, lists/dicts, reading files — the bedrock under every lesson.
- [The Official Python Tutorial — docs.python.org](https://docs.python.org/3/tutorial/)
  Authoritative reference for language syntax. Use for: checking exactly how a language feature works once you've met it.

### Algorithmic trading concepts
- [QuantStart — "Successful Backtesting of Algorithmic Trading Strategies, Part I"](https://www.quantstart.com/articles/Successful-Backtesting-of-Algorithmic-Trading-Strategies-Part-I/)
  Clear, rigorous intro to what backtesting is and the biases that wreck it. Use for: the mental model of strategy → backtest → forward test.
- [Common Pitfalls in Backtesting — overfitting, look-ahead, survivorship bias (Medium / Funny AI & Quant)](https://medium.com/funny-ai-quant/ai-algorithmic-trading-common-pitfalls-in-backtesting-a-comprehensive-guide-for-algorithmic-ce97e1b1f7f7)
  Catalogue of the ways a backtest lies to you. Use for: the "why your great backtest will lose real money" lesson.

### Crypto market data & execution (Python)
- [CCXT — official docs (docs.ccxt.com)](https://docs.ccxt.com/)
  Unified API over 100+ crypto exchanges; same code works on Binance, Kraken, Coinbase, etc. Use for: fetching prices/OHLCV and (later) placing orders.
- [CCXT — GitHub repository](https://github.com/ccxt/ccxt)
  Source, install instructions, examples. Use for: install troubleshooting and reference examples.
- [CCXT Python Tutorial (2026): Fetch OHLCV, Ticker & Order Book — Adnan Siddiqi](https://blog.adnansiddiqi.me/getting-started-with-ccxt-crypto-exchange-library-and-python/)
  Worked beginner walkthrough. Use for: a copy-along first contact with live market data.

### Full bot framework (for later, not the start)
- [Freqtrade — official docs (freqtrade.io)](https://www.freqtrade.io/en/stable/)
  Free, open-source Python crypto bot (v2026.3) with built-in backtesting and dry-run/paper trading. Use for: graduating from hand-rolled scripts to a real framework — AFTER the fundamentals are solid.
- [Freqtrade — Backtesting docs](https://www.freqtrade.io/en/stable/backtesting/)
  How professional-grade backtesting is structured. Use for: reference once you reach the backtesting lessons.
- [Freqtrade — GitHub](https://github.com/freqtrade/freqtrade)
  ~49k stars, actively maintained. Use for: real-world strategy examples and issue search.

## Wisdom (Communities)
- [r/algotrading](https://www.reddit.com/r/algotrading/)
  Largest hobbyist+pro algo-trading community; strong on backtesting reality-checks. Use for: sanity-checking a strategy before risking money, and learning what NOT to do.
- [r/learnpython](https://www.reddit.com/r/learnpython/)
  Beginner-friendly, fast answers. Use for: unblocking Python errors when the teacher (me) isn't enough.
- [Freqtrade Discord](https://www.freqtrade.io/en/stable/) (linked from the docs site)
  Active community around the framework. Use for: framework-specific help once you adopt Freqtrade.

## Gaps
- No single beginner course yet chosen that teaches *Python and trading together* — we are assembling that path lesson-by-lesson instead.
- Need a verified, free crypto **paper-trading / testnet** endpoint to target (e.g. an exchange sandbox via CCXT) — to be pinned down in the lesson where we first place a simulated order.
