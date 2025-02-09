import React from 'react'

import Droppable from '../dndKit/Droppable'
import Draggable from '../dndKit/Draggable'
import { move, shuffle } from '@/utils/array'
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

export type Point = {
  x: number
  y: number
}

export default function PuzzleBoard() {
  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [isDragging, setIsDragging] = React.useState(false)

  const [timestamp, setTimestamp] = React.useState(new Date().getTime())
  const [imgLoaded, setImgLoaded] = React.useState(false)
  const imgReloadCountRef = React.useRef(0)

  const [activePoint, setActivePoint] = React.useState<Point>()

  // const imgWidth = 900 // 640 // 1280
  // const imgHeight = 600 // 400 // 768
  // const blockSize = 150 //80 // 128

  // const numOfCol = imgWidth / blockSize
  // const numOfRow = imgHeight / blockSize

  //------------------------------------------------
  const transitionDuration = 300

  const gapSize = 3

  const blockSize = 150 //80 // 128
  const numOfCol = 4
  const numOfRow = 3

  const imgWidth = blockSize * numOfCol
  const imgHeight = blockSize * numOfRow

  const MaxImgReloadCount = 3

  const imgUrl = `https://picsum.photos/${imgWidth}/${imgHeight}.webp?random=${timestamp}`

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

  const [showAlert, setShowAlert] = React.useState(true)

  const [shuffled, setShuffled] = React.useState(false)

  React.useEffect(() => {
    setImgLoaded(false)
  }, [timestamp])

  const getTopLeft = (position: Point) => {
    const { x, y } = position
    return {
      top: y * (blockSize + gapSize) + gapSize,
      left: x * (blockSize + gapSize) + gapSize,
    }
  }

  // const shuffledPosition = React.useMemo(() => shuffle(coordinate), [])

  // console.log(coordinate)

  const handleImgLoad = () => {
    imgReloadCountRef.current = 0 // Reset
    setImgLoaded(true)
  }

  const handleNewGame = () => {
    setIsMatch(false)
    setTimestamp(new Date().getTime())
    setShuffledPosition(shuffle(coordinate))
  }

  const handleCloseAlert = () => {
    setShowAlert(false)
  }

  const handleImgLoadError = () => {
    if (imgReloadCountRef.current < MaxImgReloadCount) {
      imgReloadCountRef.current++
      setTimestamp(new Date().getTime())
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    // console.log('onDragStart', event)

    const activeId = event.active.id.toString()
    const arr = activeId.split(',').map((a) => parseInt(a))
    const [x, y] = arr
    const point: Point = { x, y }
    setActivePoint(point)

    // setIsDragging(true)
    // setActiveItem(todoListArr.find((a) => a.status.name == event.active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    // console.log('DragEndEvent', event)

    setActivePoint(undefined)

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

      if (_isMatch) setShowAlert(true)
    }
  }

  return (
    <>
      <div className='relative h-[30px]'>
        <div
          role='alert'
          className={`absolute mt-1 mb-2 alert alert-success ${
            isMatch && showAlert ? '' : 'pointer-events-none'
          }`}
          style={{
            transitionProperty: 'top, opacity',
            transitionDuration: transitionDuration + 'ms',
            transitionTimingFunction: 'ease-out',
            ...(isMatch && showAlert ? { top: 0 } : { top: -500, opacity: 0 }),
          }}
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
          <span>Congratulations!Puzzle Completed Successfully!</span>
          <div className='flex justify-end gap-2'>
            <button className='btn btn-sm' onClick={handleNewGame}>
              New Game
            </button>
            <button
              className='btn btn-sm  btn-neutral'
              onClick={handleCloseAlert}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* <div>PuzzleBoard</div> */}

      <div className='mb-3 flex gap-2'>
        {/* <button
          className='btn btn-sm btn-outline btn-primary'
          onClick={() => setShuffled(!shuffled)}
        >
          Shuffle ({shuffled.toString()})
        </button>

        <button
          className='btn btn-sm btn-outline btn-primary'
          onClick={() => setIsMatch(!isMatch)}
        >
          set isMatch ({isMatch.toString()})
        </button> */}

        {/* <button
          className={`btn btn-sm btn-primary ${
            imgLoaded ? '' : 'btn-disabled'
          }`}
          onClick={() => handleNewGame()}
        >
          New Game
        </button> */}

        <button
          className={`btn btn-sm btn-primary ${
            imgLoaded ? '' : 'btn-disabled'
          }`}
          onClick={() => setTimestamp(new Date().getTime())}
        >
          Change Image
        </button>
      </div>

      <div
        className='mb-3 inline-block shadow-2xl'
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
          onLoad={handleImgLoad}
          onError={handleImgLoadError}
        />
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        // onDragOver={(event) => console.log('onDragOver', event)}
        onDragEnd={handleDragEnd}
      >
        {/* w-fit mb-10 */}
        <div
          className={`mb-10`}
          style={{ width: (blockSize + gapSize) * numOfCol + gapSize }}
        >
          <div
            className={`relative w-full grid bg-slate-200`}
            style={{
              padding: gapSize,
              gap: gapSize,
              gridTemplateColumns: `repeat(${numOfCol}, minmax(0, 1fr))`,
            }}
          >
            {coordinate.map(({ x, y }, i) => (
              <Droppable
                key={`${x},${y}`}
                uniqueId={`${x},${y}`}
                render={(useDroppableResult) => {
                  const { setNodeRef, isOver } = useDroppableResult
                  return (
                    <div
                      ref={setNodeRef}
                      className='aspect-square bg-white'
                      style={{
                        width: blockSize,
                        ...(isOver
                          ? {
                              opacity: 0.5,
                              outline: '2px solid oklch(var(--p))',
                            }
                          : {}),
                      }}
                    >
                      {/* <div className='absolute'>{`${shuffledPosition[i].x},${shuffledPosition[i].y}`}</div> */}
                      <Draggable
                        uniqueId={`${shuffledPosition[i].x},${shuffledPosition[i].y}`}
                        render={(useDraggableResult) => {
                          const {
                            attributes,
                            listeners,
                            setNodeRef,
                            transform,
                          } = useDraggableResult
                          const transformStyle = {
                            transform: CSS.Translate.toString(transform),
                          }

                          return (
                            <div
                              ref={setNodeRef}
                              {...listeners}
                              {...attributes}
                              className={`aspect-square`}
                              style={{
                                width: blockSize,
                                backgroundImage: `url("${imgUrl}")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: `-${
                                  shuffledPosition[i].x * blockSize
                                }px -${shuffledPosition[i].y * blockSize}px`,
                                ...transformStyle,
                                //
                                position: 'absolute',
                                opacity: imgLoaded ? 1 : 0,
                                ...getTopLeft({
                                  x: imgLoaded ? x : 0,
                                  y: imgLoaded ? y : 0,
                                }),
                                transitionProperty: 'top,left',
                                transitionDuration: `${transitionDuration}ms`,
                                transitionTimingFunction: 'ease-in-out',
                              }}
                            ></div>
                          )
                        }}
                      />
                    </div>
                  )
                }}
              />
            ))}

            <DragOverlay>
              {activePoint && (
                <div
                  className={`aspect-square drop-shadow-xl`}
                  style={{
                    width: blockSize,
                    backgroundImage: `url("${imgUrl}")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: `-${activePoint.x * blockSize}px -${
                      activePoint.y * blockSize
                    }px`,
                  }}
                ></div>
              )}
            </DragOverlay>
          </div>
        </div>
      </DndContext>
    </>
  )
}
