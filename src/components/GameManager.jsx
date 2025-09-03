import { useCallback, useRef, useState } from "react";
import { produce } from "immer";
import GameGrid from "./GameGrid";

export default function GameManager() {
  const numRows = 50;
  const numCols = 50;
  const generateEmptyGrid = () => {
    const rows = [];

    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }

    return rows;
  };
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const operations = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [-1, 0],
    [1, 0],
  ];

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;

            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 100);
  }, []);

  return (
    <>
      <main
        style={{
          height: "100vh",
          backgroundColor: "#ffffffff",
        }}
      >
        <div
          className="grid"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <GameGrid grid={grid} setGrid={setGrid} numCols={numCols} />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div className="controls">
            <button
              onClick={() => {
                setRunning(!running);
                if (!running) {
                  runningRef.current = true;
                  runSimulation();
                }
              }}
            >
              {running ? "Stop" : "Play"}
            </button>
            <button
              onClick={() => {
                const rows = [];

                for (let i = 0; i < numRows; i++) {
                  rows.push(
                    Array.from(Array(numCols), () =>
                      Math.random() > 0.7 ? 1 : 0
                    )
                  );
                }

                setGrid(rows);
              }}
            >
              Random
            </button>
            <button onClick={() => setGrid(generateEmptyGrid())}>Clear</button>
          </div>
        </div>
      </main>
    </>
  );
}
