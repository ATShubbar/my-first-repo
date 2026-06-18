/* Reusable quiz widget shared across lessons.
 *
 * Markup contract (see any lesson for an example):
 *   <div class="quiz">
 *     <p class="quiz-q">Question?</p>
 *     <button class="quiz-option" data-correct="true">Right answer</button>
 *     <button class="quiz-option">Wrong answer</button>
 *     <p class="quiz-explain"><b>Why:</b> explanation shown after answering.</p>
 *   </div>
 *
 * Behavior: immediate, automatic feedback (retrieval practice). On the first
 * click the chosen option is marked correct/incorrect, the correct option is
 * revealed, the explanation appears, and the question locks.
 */
(function () {
  function wireQuiz(quiz) {
    var options = Array.prototype.slice.call(quiz.querySelectorAll('.quiz-option'));
    var explain = quiz.querySelector('.quiz-explain');
    var answered = false;

    options.forEach(function (opt) {
      opt.addEventListener('click', function () {
        if (answered) return;
        answered = true;

        var isCorrect = opt.getAttribute('data-correct') === 'true';
        opt.classList.add(isCorrect ? 'correct' : 'incorrect');

        // Always reveal the correct option, even on a wrong guess.
        options.forEach(function (o) {
          o.disabled = true;
          if (o.getAttribute('data-correct') === 'true') o.classList.add('correct');
        });

        if (explain) explain.classList.add('show');
      });
    });
  }

  function init() {
    document.querySelectorAll('.quiz').forEach(wireQuiz);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
