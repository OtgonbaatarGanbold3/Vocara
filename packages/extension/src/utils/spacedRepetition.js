/**
 * spacedRepetition — SM-2 spaced repetition algorithm implementation.
 *
 * Based on the SuperMemo SM-2 algorithm:
 * https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-of-learning
 *
 * Grades: 0 = complete blackout, 5 = perfect response
 */
/**
 * Creates a new ReviewCard with default SM-2 initial values.
 */
export function createReviewCard() {
    return {
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        nextReviewDate: new Date().toISOString(),
    };
}
/**
 * Applies an SM-2 grade (0–5) to a card and returns an updated card.
 *
 * @param card - The current card state
 * @param grade - Quality of the response (0 = total failure, 5 = perfect)
 * @returns Updated card with new interval, ease factor, and next review date
 */
export function gradeCard(card, grade) {
    if (grade < 0 || grade > 5) {
        throw new RangeError(`Grade must be between 0 and 5, got ${grade}`);
    }
    let { easeFactor, interval, repetitions } = card;
    if (grade >= 3) {
        // Correct response
        if (repetitions === 0) {
            interval = 1;
        }
        else if (repetitions === 1) {
            interval = 6;
        }
        else {
            interval = Math.round(interval * easeFactor);
        }
        repetitions += 1;
    }
    else {
        // Incorrect response — reset repetitions and interval
        repetitions = 0;
        interval = 1;
    }
    // Update ease factor: EF(new) = EF + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
    easeFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    // Enforce minimum ease factor
    if (easeFactor < 1.3)
        easeFactor = 1.3;
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);
    return {
        easeFactor,
        interval,
        repetitions,
        nextReviewDate: nextReviewDate.toISOString(),
    };
}
/**
 * Returns true if the card is due for review (next review date is today or past).
 */
export function isCardDue(card) {
    return new Date(card.nextReviewDate) <= new Date();
}
/**
 * Returns the next review Date object for the given card.
 */
export function getNextReviewDate(card) {
    return new Date(card.nextReviewDate);
}
