export default function getRandomRuns(probability: any) {
    let cumulativeProbability = 0;
    const random = Math.random();
  
    for (const number in probability) {
      cumulativeProbability += probability[number];
      if (random < cumulativeProbability) {
        return Number(number);
      }
    }
  
    return null; // If something goes wrong or the probabilities are invalid
  }