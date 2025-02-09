import React from 'react'

import Droppable from '../dndKit/Droppable'
import Draggable from '../dndKit/Draggable'
import { move, shuffle } from '@/utils/array'
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'

export type Point = {
  x: number
  y: number
}

export default function PuzzleBoard() {
  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [isDragging, setIsDragging] = React.useState(false)

  const [imgLoaded, setImgLoaded] = React.useState(false)

  // const imgWidth = 900 // 640 // 1280
  // const imgHeight = 600 // 400 // 768
  // const blockSize = 150 //80 // 128

  // const numOfCol = imgWidth / blockSize
  // const numOfRow = imgHeight / blockSize

  //------------------------------------------------
  const blockSize = 150 //80 // 128
  const numOfCol = 4
  const numOfRow = 3

  const imgWidth = blockSize * numOfCol
  const imgHeight = blockSize * numOfRow

  const imgUrl = `https://picsum.photos/${imgWidth}/${imgHeight}.webp`

  const coordinate: Point[] = ([] as Point[]).concat(
    ...Array(numOfRow)
      .fill(0)
      .map((v1, rowIndex) =>
        Array(numOfCol)
          .fill(0)
          .map((v2, colIndex): Point => ({ x: colIndex, y: rowIndex }))
      )
  )

  const [shuffledPosition, setShuffledPosition] = React.useState<Point[]>(
    shuffle(coordinate)
  )
  const [isMatch, setIsMatch] = React.useState(false)

  // const shuffledPosition = React.useMemo(() => shuffle(coordinate), [])

  // console.log(coordinate)

  const handleDragStart = (event: DragStartEvent) => {
    // console.log('onDragStart', event)
    // setIsDragging(true)
    // setActiveItem(todoListArr.find((a) => a.status.name == event.active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    // console.log('DragEndEvent', event)
    // setIsDragging(false)

    const { active, over } = event
    if (over) {
      const newList = [...shuffledPosition]
      const oldIndex = shuffledPosition.findIndex(
        (a) => `${a.x},${a.y}` == active.id
      )
      const newIndex = coordinate.findIndex((a) => `${a.x},${a.y}` == over.id)

      ;[newList[oldIndex], newList[newIndex]] = [
        newList[newIndex],
        newList[oldIndex],
      ]
      setShuffledPosition(newList)

      let _isMatch = true
      for (let i = 0; i < newList.length; i++) {
        if (
          newList[i].x != coordinate[i].x ||
          newList[i].y != coordinate[i].y
        ) {
          _isMatch = false
          break
        }
      }
      setIsMatch(_isMatch)
    }
  }

  return (
    <>
      <div>PuzzleBoard</div>

      <div
        className='inline-block shadow-lg'
        style={{
          height: 150,
          aspectRatio: numOfCol / numOfRow,
        }}
      >
        <div
          className='skeleton w-full h-full rounded-none'
          style={{ display: imgLoaded ? 'none' : undefined }}
        ></div>
        <img
          src={imgUrl}
          style={{ height: '100%', display: imgLoaded ? undefined : 'none' }}
          onLoad={() => setImgLoaded(true)}
        />
      </div>

      <div
        role='alert'
        className={`mt-1 mb-2 alert alert-success ${
          isMatch ? '' : 'opacity-0 pointer-events-none'
        }`}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6 shrink-0 stroke-current'
          fill='none'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
        <span>Congratulations!</span>
      </div>

      {/* <div
        className={`mt-5 mb-10 w-fit grid gap-0 bg-slate-200`}
        style={{ gridTemplateColumns: `repeat(${numOfCol}, minmax(0, 1fr))` }}
      >
        {Array(numOfRow)
          .fill(0)
          .map((v1, rowIndex) =>
            Array(numOfCol)
              .fill(0)
              .map((v2, colIndex) => (
                <div
                  key={`${rowIndex},${colIndex}`}
                  className={`aspect-square`}
                  style={{
                    width: blockSize,
                    // background: `no-repeat ${
                    //   ((colIndex * blockSize) / imgWidth) * 100
                    // }% ${
                    //   ((rowIndex * blockSize) / imgHeight) * 100
                    // }% url("${imgUrl}")`,
                    backgroundImage: `url("${imgUrl}")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: `${
                      ((colIndex * blockSize) / imgWidth) * 100
                    }% ${((rowIndex * blockSize) / imgHeight) * 100}%`,
                  }}
                >{`${rowIndex},${colIndex}`}</div>
              ))
          )}
      </div> */}

      {/* <div
        className={`mt-5 mb-10 p-2 w-fit grid gap-2 bg-slate-200`}
        style={{ gridTemplateColumns: `repeat(${numOfCol}, minmax(0, 1fr))` }}
      >
        {Array(numOfRow)
          .fill(0)
          .map((v1, rowIndex) =>
            Array(numOfCol)
              .fill(0)
              .map((v2, colIndex) => (
                <div
                  key={`${rowIndex},${colIndex}`}
                  className='aspect-square bg-white'
                  style={{ width: blockSize }}
                >
                  <div
                    className={`aspect-square`}
                    style={{
                      width: blockSize,
                      backgroundImage: `url("${imgUrl}")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: `-${colIndex * blockSize}px -${
                        rowIndex * blockSize
                      }px`,
                    }}
                  >{`${rowIndex},${colIndex}`}</div>
                </div>
              ))
          )}
      </div> */}

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={(event) => console.log('onDragOver', event)}
        onDragEnd={handleDragEnd}
      >
        <div
          className={`relative mb-10 p-0 w-fit grid gap-0 bg-slate-200`}
          style={{ gridTemplateColumns: `repeat(${numOfCol}, minmax(0, 1fr))` }}
        >
          {coordinate.map(({ x, y }, i) => (
            <Droppable key={`${x},${y}`} uniqueId={`${x},${y}`}>
              <div
                className='aspect-square bg-white'
                style={{ width: blockSize }}
              >
                {/* <div className='absolute'>{`${shuffledPosition[i].x},${shuffledPosition[i].y}`}</div> */}
                <Draggable
                  uniqueId={`${shuffledPosition[i].x},${shuffledPosition[i].y}`}
                >
                  <div
                    className={`absolute aspect-square`}
                    style={{
                      width: blockSize,
                      backgroundImage: `url("${imgUrl}")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: `-${
                        shuffledPosition[i].x * blockSize
                      }px -${shuffledPosition[i].y * blockSize}px`,
                      border: '2px solid grey',
                    }}
                  ></div>
                </Draggable>
              </div>
            </Droppable>
          ))}
        </div>
      </DndContext>
    </>
  )
}
