export const move = (arr: any[], from: number, to: number) => {
  const newArr = [...arr]
  try {
    if (from > newArr.length - 1 || to > newArr.length - 1)
      throw new Error('Index cannot greater than the length of array')

    const item = newArr.splice(from, 1)[0]
    newArr.splice(to, 0, item)
  } catch (error) {
    console.error(error)
  }

  return newArr
}

// https://javascript.info/task/shuffle
export function shuffle(array: any[]) {
  const newArray = [...array]
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)) // random index from 0 to i

    // swap elements array[i] and array[j]
    // we use "destructuring assignment" syntax to achieve that
    // you'll find more details about that syntax in later chapters
    // same can be written as:
    // let t = array[i]; array[i] = array[j]; array[j] = t
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}
