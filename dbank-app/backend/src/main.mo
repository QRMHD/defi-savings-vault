import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Float "mo:base/Float";

actor {
  // Use Float for balance and interest calculations
  var currentBalance : Float = 100.0;
  var lastUpdatedTime : Time.Time = Time.now();

  // 5% interest per compounding period (e.g. per 10 seconds for testing)
  let interestRate : Float = 0.05;
  // 10 seconds in nanoseconds (1 second = 1,000,000,000 ns)
  let compoundingPeriodNs : Int = 10_000_000_000;

  // Calculates compound interest: A = P * (1 + r)^n
  private func applyInterest() {
    let currentTime = Time.now();
    let elapsedNs = currentTime - lastUpdatedTime;

    // Number of full periods elapsed
    let periods = elapsedNs / compoundingPeriodNs;

    if (periods > 0) {
      // Compound interest multiplier: (1 + r)^n
      let growthFactor = Float.pow(1.0 + interestRate, Float.fromInt(periods));
      currentBalance := currentBalance * growthFactor;

      // Advance lastUpdatedTime by the credited elapsed periods
      lastUpdatedTime := lastUpdatedTime + (periods * compoundingPeriodNs);

      Debug.print("Applied interest for " # debug_show(periods) # " periods. New balance: " # debug_show(currentBalance));
    };
  };

  // Deposit function
  public func topUp(amount : Float) : async Float {
    applyInterest();
    currentBalance += amount;
    return currentBalance;
  };

  // Withdraw function
  public func withdraw(amount : Float) : async Text {
    applyInterest();

    if (amount > currentBalance) {
      Debug.print("Insufficient funds. Balance: " # debug_show(currentBalance));
      return "Insufficient funds";
    } else {
      currentBalance -= amount;
      Debug.print("Withdrawal successful. New balance: " # debug_show(currentBalance));
      return "Withdrawal successful";
    };
  };

  // Query current balance (with preview of accrued interest)
  public query func checkBalance() : async Float {
    let currentTime = Time.now();
    let elapsedNs = currentTime - lastUpdatedTime;
    let periods = elapsedNs / compoundingPeriodNs;

    if (periods > 0) {
      let growthFactor = Float.pow(1.0 + interestRate, Float.fromInt(periods));
      return currentBalance * growthFactor;
    } else {
      return currentBalance;
    };
  };
};