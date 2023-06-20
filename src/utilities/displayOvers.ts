export default function displayOvers(balls: number) {
    const overs = Math.floor(balls / 6);
    const remainingBalls = balls % 6;
  
    if (remainingBalls === 0) {
      return `${overs}`;
    } else {
      return `${overs}.${remainingBalls}`;
    }
  }