/**
 * 🚂 IRCTC Tatkal Reservation System
 *
 * IRCTC ka simplified reservation system bana! Passengers ka list hai,
 * trains ka list hai with available seats. Har passenger ko uski preferred
 * class mein seat dene ki koshish kar. Agar nahi mili, toh fallback class
 * try kar. Agar woh bhi nahi, toh waitlist kar de.
 *
 * Train object structure:
 *   { trainNumber: "12345", name: "Rajdhani Express",
 *     seats: { sleeper: 3, ac3: 2, ac2: 1, ac1: 0 } }
 *
 * Passenger object structure:
 *   { name: "Rahul", trainNumber: "12345",
 *     preferred: "ac3", fallback: "sleeper" }
 *
 * Rules (use nested loops):
 *   - Process passengers in order (FIFO - first come first served)
 *   - For each passenger:
 *     1. Find the train matching trainNumber
 *     2. Try preferred class first: if seats > 0, allocate (decrement seat count)
 *        Result: { name, trainNumber, class: preferred, status: "confirmed" }
 *     3. If preferred not available, try fallback class
 *        Result: { name, trainNumber, class: fallback, status: "confirmed" }
 *     4. If neither available, waitlist the passenger
 *        Result: { name, trainNumber, class: preferred, status: "waitlisted" }
 *     5. If train not found, result:
 *        { name, trainNumber, class: null, status: "train_not_found" }
 *   - Seats are MUTATED: when a seat is allocated, decrement the count
 *     so later passengers see updated availability
 *
 * Validation:
 *   - Agar passengers ya trains array nahi hai ya empty hai, return []
 *
 * @param {Array<{name: string, trainNumber: string, preferred: string, fallback: string}>} passengers
 * @param {Array<{trainNumber: string, name: string, seats: Object<string, number>}>} trains
 * @returns {Array<{name: string, trainNumber: string, class: string|null, status: string}>}
 *
 * @example
 *   railwayReservation(
 *     [{ name: "Rahul", trainNumber: "12345", preferred: "ac3", fallback: "sleeper" }],
 *     [{ trainNumber: "12345", name: "Rajdhani", seats: { sleeper: 5, ac3: 0, ac2: 1, ac1: 0 } }]
 *   )
 *   // ac3 has 0 seats, try fallback sleeper (5 seats), allocated!
 *   // => [{ name: "Rahul", trainNumber: "12345", class: "sleeper", status: "confirmed" }]
 */
export function railwayReservation(passengers, trains) {
  // Your code here

  // Validation Check
  if (
    !Array.isArray(passengers) ||
    !Array.isArray(trains) ||
    passengers.length === 0 ||
    trains.length === 0
  ) {
    return [];
  }

  // store the train list in a variable to update the seat count as we allocate seats to passengers;
  let trainList = trains;
  const finalLists = [];

  // Iterate over the passengers list and for each passenger, find the train and allocate seat based on the preferred and fallback class.
  for (const passenger of passengers) {

    // flag to check if the train is found for the passenger or not. If not found, we will add the passenger to the final list with status "train_not_found". 
    let trainFound = false;

    // Iterate over the train list to find the train matching the passenger's train number. If found, try to allocate seat based on preferred and fallback class. If not found, update the flag trainFound to false to update the passenger status.
    for (const train of trainList) {
      if (passenger.trainNumber === train.trainNumber) {
        trainFound = true;

        const preferedSeat = Object.keys(train.seats).includes(
          passenger.preferred,
        )
          ? train.seats[passenger.preferred]
          : null;
        if (preferedSeat && preferedSeat > 0) {
          finalLists.push({
            name: passenger.name,
            class: passenger.preferred,
            status: "confirmed",
            trainNumber: passenger.trainNumber,
          });
          trainList = updateSeatAllocation(
            {
              trainNumber: passenger.trainNumber,
              seat: passenger.preferred,
              count: -1,
            },
            trainList,
          );

          break;
        } else {
          const fallbackSeat = Object.keys(train.seats).includes(
            passenger.fallback,
          )
            ? train.seats[passenger.fallback]
            : null;

          if (fallbackSeat && fallbackSeat > 0) {
            finalLists.push({
              name: passenger.name,
              class: passenger.fallback,
              status: "confirmed",
              trainNumber: passenger.trainNumber,
            });
            trainList = updateSeatAllocation(
              {
                trainNumber: passenger.trainNumber,
                seat: passenger.fallback,
                count: -1,
              },
              trainList,
            );
            break;
          } else {
            finalLists.push({
              name: passenger.name,
              class: passenger.preferred,
              status: "waitlisted",
              trainNumber: passenger.trainNumber,
            });
            break;
          }
        }
      }
    }

    if (!trainFound) {
      finalLists.push({
        name: passenger.name,
        class: null,
        status: "train_not_found",
        trainNumber: passenger.trainNumber,
      });
    }
  }

  return finalLists;
}

/**
 * 
 * @param {{ trainNumber: string, seat: string, count: number }} param0
 * @param {Array<{trainNumber: string, name: string, seats: Object<string, number>}>} trainList
 * @returns {Array<{trainNumber: string, name: string, seats: Object<string, number>}>}
 */
function updateSeatAllocation({ trainNumber, seat, count }, trainList) {
  const finalTrainList = trainList.map((train) => {
    if (train.trainNumber === trainNumber) {
      const seatCount = train.seats[seat] + count;
      const finalTrain = {
        ...train,
        seats: { ...train.seats, [seat]: seatCount },
      };
      return finalTrain;
    } else {
      return { ...train };
    }
  });

  return finalTrainList;
}
