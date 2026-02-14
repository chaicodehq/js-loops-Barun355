/**
 * 💸 Bunty ka UPI Payment Retry
 *
 * Bunty apne dost ko paise bhej raha hai UPI se, lekin network thoda
 * flaky hai. Payment kabhi success hota hai, kabhi fail. Bunty ka app
 * automatically retry karta hai with exponential backoff.
 *
 * Rules (use do...while loop):
 *   - outcomes is an array of strings: "success" or "fail"
 *   - ALWAYS attempt at least once (that's why do...while!)
 *   - outcomes[0] is the result of attempt 1, outcomes[1] is attempt 2, etc.
 *   - If the attempt is "success", stop immediately
 *   - If the attempt is "fail", add wait time and try again
 *   - Wait times follow exponential backoff: 1s, 2s, 4s, 8s
 *     (wait time is added AFTER a failed attempt, before next retry)
 *   - Maximum 5 attempts total (if all fail, stop after 5th)
 *   - totalWaitTime = sum of all wait times between attempts
 *
 * Validation:
 *   - Agar outcomes array nahi hai ya empty hai,
 *     return: { attempts: 0, success: "fail", totalWaitTime: 0 }
 *
 * @param {string[]} outcomes - Array of "success" or "fail" for each attempt
 * @returns {{ attempts: number, success: boolean, totalWaitTime: number }}
 *
 * @example
 *   upiRetry(["fail", "fail", "success"])
 *   // Attempt 1: fail, wait 1s
 *   // Attempt 2: fail, wait 2s
 *   // Attempt 3: success!
 *   // => { attempts: 3, success: true, totalWaitTime: 3 }
 *
 *   upiRetry(["fail", "fail", "fail", "fail", "fail", "fail"])
 *   // 5 attempts all fail, wait: 1+2+4+8 = 15s (no wait after last)
 *   // => { attempts: 5, success: false, totalWaitTime: 15 }
 */
export function upiRetry(outcomes) {
  // Your code here

  if (!Array.isArray(outcomes) || outcomes.length === 0) {
    return { attempts: 0, success: false, totalWaitTime: 0 };
  }

  const finalData = {
    attempts: 0,
    success: false,
    totalWaitTime: 0,
  };

  let counter = 0;
  do {
    const outcome = outcomes[counter];
    
    if (finalData.attempts > 4) {
      finalData.attempts = 5;
      finalData.totalWaitTime = 15;
      break;
    }
    
    if (outcome === "fail") {
      // simulating delay for (finalData.totalWaitTime === 0? 1: 2 ** counter)
      if (finalData.attempts === 4) {
        finalData.attempts = 5;
        finalData.totalWaitTime = 15;
        break;
      } else {
        ++finalData.attempts;
        finalData.totalWaitTime +=
          finalData.totalWaitTime === 0 ? 1 : 2 ** counter;
      }
    } else if (outcome === "success") {
      ++finalData.attempts;
      finalData.success = true;
      break;
    }

    counter++;
  } while (counter < outcomes.length);
  
  return finalData;
}