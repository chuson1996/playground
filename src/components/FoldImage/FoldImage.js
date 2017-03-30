import React, { Component, PropTypes } from 'react';
import styled, { css } from 'styled-components';
// import map from 'lodash/map';
// import max from 'lodash/max';
// import last from 'lodash/last';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const CanvasContainer = styled.div`
  display: flex;
  perspective: 300px;

  ${({ animating }) => animating && css`
    ${({ direction }) => direction === 'down' && css`
      perspective-origin: top;
    `}
    ${({ direction }) => direction === 'toRight' && css`
      perspective-origin: left;
    `}
  `}
`;

const easing = 'cubic-bezier(0.360, 0.000, 0.000, 1.525)';
const Canvas = styled.canvas`
  transition: transform ${({ duration }) => duration || 0.3}s ${easing}, opacity ${({ duration }) => duration / 2 || 0.3}s;

  ${({ animating }) => !animating && css`
    ${({ left }) => left && css`
      transform-origin: right;
      &:hover {
        transform: rotateY(-10deg);
      }
    `}
    ${({ right }) => right && css`
      transform-origin: left;
      &:hover {
        transform: rotateY(10deg);
      }
    `}
    ${({ top }) => top && css`
      transform-origin: bottom;
      &:hover {
        transform: rotateX(10deg);
      }
    `}
    ${({ bottom }) => bottom && css`
      transform-origin: top;
      &:hover {
        transform: rotateX(-10deg);
      }
    `}
    ${(({ left, top }) => left && top && css`
      transform-origin: 100% 100%;
      &:hover {
        transform: rotateX(5deg) rotateY(-5deg);
      }
    `)}
    ${(({ left, bottom }) => left && bottom && css`
      transform-origin: 100% 0;
      &:hover {
        transform: rotateX(-5deg) rotateY(-5deg);
      }
    `)}
    ${(({ right, top }) => right && top && css`
      transform-origin: 0 100%;
      &:hover {
        transform: rotateX(5deg) rotateY(5deg);
      }
    `)}
    ${(({ right, bottom }) => right && bottom && css`
      transform-origin: 0 0;
      &:hover {
        transform: rotateX(-5deg) rotateY(5deg);
      }
    `)}
  `}

  opacity: 1;
  ${({ hide, direction }) => {
    if (direction === 'down') return css`
      ${({ animating }) => animating && css`
        transform-origin: top;
      `}
      ${hide && css`
        opacity: 0;
        transform: rotateX(90deg);`}
    `;
    if (direction === 'toRight') return css`
      ${({ animating }) => animating && css`
        transform-origin: left;
      `}
      ${hide && css`
        opacity: 0;
        transform: rotateY(-90deg);`}
    `;
    if (direction === 'up') return css`
      ${({ animating }) => animating && css`
        transform-origin: bottom;
      `}
      ${hide && css`
        opacity: 0;
        transform: rotateX(90deg);`}
    `;
    if (direction === 'toLeft') return css`
      ${({ animating }) => animating && css`
        transform-origin: right;
      `}
      ${hide && css`
        opacity: 0;
        transform: rotateY(90deg);`}
    `;
  }}
`;

const Relative = styled.div`
  position: relative;
`;

// --------------- CONSTANTS ------------------
const AM_SLOW = 1;
const AM_FAST = AM_SLOW * 0.8;
const EARLY_RATIO = 0.5;

// --------------- Component -------------------

export default class FoldImage extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    noCol: PropTypes.number,
    noRow: PropTypes.number,
    startingPoint: PropTypes.number,
    startingDirection: PropTypes.string,
    hide: PropTypes.bool
  };

  static defaultProps = {
    noCol: 4,
    noRow: 4,
  };

  constructor(props) {
    super(props);
    this.canvases = [];
    this.animationMatrix = {};
    this.timeouts = [];
    this.currentTimestamp = 0;
    this.state = {
      canvas: {
        width: 0,
        height: 0
      },
      canvasProps: Array(4 * 4).fill({
        animating: false,
        hide: props.hide
      }),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.isChanged(this.props, nextProps, 'hide')) {
      if (nextProps.hide) {
        this.animateOut();
      } else {
        this.animateIn();
      }
    }

    if (this.isChanged(this.props, nextProps, ['startingPoint', 'noCol', 'noRow'])) {
      this.generateAnimationMatrix(nextProps.startingPoint, AM_FAST, 0, nextProps.startingDirection);
    }
  }

  isChanged(oldScope, newScope, props) {
    const _props = Array.isArray(props) ? props : [props];
    return _props.some((prop) => oldScope[prop] !== newScope[prop]);
  }

  componentDidMount() {
    this.img = new Image();
    this.img.src = this.props.src;
    const {startingPoint, startingDirection} = this.props;

    this.img.onload = () => {
      const { width, height } = this.img;
      this.setState({ canvas: { width, height }});

      this.draw();
    };

    this.generateAnimationMatrix(startingPoint, AM_FAST, 0, startingDirection);
    if (!this.props.hide) {
      this.animateIn();
    }
  }

  generateAnimationMatrix(start, duration = 0, startingTimestamp = 0, direction = null, trace = []) {
    if (start < 0 || start > this.props.noCol * this.props.noRow) return;
    if (!this.animationMatrix[start]) {
      // console.log(`${start}: ${startingTimestamp}. ${direction}. Prev ${last(trace)}`);
      this.animationMatrix[start] = {
        duration,
        startingTimestamp,
        direction
      };
    } else {
      const oldStartingTimestamp = this.animationMatrix[start].duration + this.animationMatrix[start].startingTimestamp;
      const newStartingTimestamp = duration + startingTimestamp;

      if (oldStartingTimestamp > newStartingTimestamp) {
        // console.log(`${start}: ${oldStartingTimestamp}->${newStartingTimestamp}. ${this.animationMatrix[start].direction}->${direction}. Prev: ${last(trace)}`);
        this.animationMatrix[start] = {
          duration,
          startingTimestamp,
          direction
        };
      }
    }

    this.setState((prevState) => ({
      canvasProps: {
        ...prevState.canvasProps,
        [start]: {
          ...prevState.canvasProps[start],
          direction: this.animationMatrix[start].direction,
          duration: this.animationMatrix[start].duration,
          hide: true
        }
      }
    }));

    if (this.getNthRow(start) < this.props.noRow) {
      const nextPosition = this.getIndex(
        this.getNthCol(start),
        this.getNthRow(start) + 1
      );
      if (trace.indexOf(nextPosition) === -1) {
        this.generateAnimationMatrix(
          nextPosition,
          AM_FAST,
          startingTimestamp + duration,
          'down',
          [...trace, start]
        );
      }
    }

    if (this.getNthCol(start) < this.props.noCol) {
      const nextPosition = this.getIndex(
        this.getNthCol(start) + 1,
        this.getNthRow(start)
      );
      if (trace.indexOf(nextPosition) === -1) {
        this.generateAnimationMatrix(
          nextPosition,
          AM_SLOW,
          startingTimestamp + duration,
          'toRight',
          [...trace, start]
        );
      }
    }

    if (this.getNthRow(start) > 1) {
      const nextPosition = this.getIndex(
        this.getNthCol(start),
        this.getNthRow(start) - 1
      );
      if (trace.indexOf(nextPosition) === -1) {
        this.generateAnimationMatrix(
          nextPosition,
          AM_FAST,
          startingTimestamp + duration,
          'up',
          [...trace, start]
        );
      }
    }

    if (this.getNthCol(start) > 1) {
      const nextPosition = this.getIndex(
        this.getNthCol(start) - 1,
        this.getNthRow(start)
      );
      if (trace.indexOf(nextPosition) === -1) {
        this.generateAnimationMatrix(
          this.getIndex(
            this.getNthCol(start) - 1,
            this.getNthRow(start)
          ),
          AM_SLOW,
          startingTimestamp + duration,
          'toLeft',
          [...trace, start]
        );
      }
    }
  }

  componentDidUpdate() {
    this.draw();
  }

  componentWillUnmount() {
    this.clearTimeouts();
  }

  clearTimeouts() {
    this.timeouts.forEach((timeout) => {
      timeout && clearTimeout(timeout);
    });
  }

  animateIn() {
    this.clearTimeouts();
    for (const i in this.animationMatrix) {
      const { startingTimestamp, duration } = this.animationMatrix[i];
      const timeout = setTimeout(() => {
        this.currentTimestamp = startingTimestamp;
        this.setState(({canvasProps}) => ({
          canvasProps: {
            ...canvasProps,
            [i]: {
              ...canvasProps[i],
              animating: true,
              hide: false
            }
          }
        }));

        const timeout2 = setTimeout(() => {
          this.setState(({canvasProps}) => ({
            canvasProps: {
              ...canvasProps,
              [i]: {
                ...canvasProps[i],
                animating: false,
              }
            }
          }));
        }, duration * 1000);
        this.timeouts = [...this.timeouts, timeout2];
      }, (startingTimestamp - this.currentTimestamp) * 1000 * EARLY_RATIO);
      this.timeouts = [...this.timeouts, timeout];
    }
  }

  animateOut() {
    this.clearTimeouts();
    for (const i in this.animationMatrix) {
      const { startingTimestamp, duration } = this.animationMatrix[i];
      const timeout = setTimeout(() => {
        this.currentTimestamp = startingTimestamp;
        this.setState(({canvasProps}) => ({
          canvasProps: {
            ...canvasProps,
            [i]: {
              ...canvasProps[i],
              animating: true,
              hide: true
            }
          }
        }));

        const timeout2 = setTimeout(() => {
          this.setState(({canvasProps}) => ({
            canvasProps: {
              ...canvasProps,
              [i]: {
                ...canvasProps[i],
                animating: false,
              }
            }
          }));
        }, duration * 1000);
        this.timeouts = [...this.timeouts, timeout2];
      }, (this.currentTimestamp - startingTimestamp) * 1000 * EARLY_RATIO);
      this.timeouts = [...this.timeouts, timeout];
    }
  }

  draw() {
    const { width, height } = this.img;
    const { noRow, noCol } = this.props;
    const blockWidth = width / noCol;
    const blockHeight = height / noRow;
    this.canvases.forEach((canvas, index) => {
      const nthRow = this.getNthRow(index);
      const nthCol = this.getNthCol(index);

      canvas.getContext('2d').drawImage(this.img,
        (nthCol - 1) * blockWidth, (nthRow - 1) * blockHeight, blockWidth, blockHeight,
        0, 0, canvas.width, canvas.height
      )
    });
  }

  getNthRow = (index) => {
    const { noCol } = this.props;
    return Math.ceil((index + 1) / noCol);
  }

  getNthCol = (index) => {
    const { noCol } = this.props;
    return (index + 1) % noCol || noCol;
  }

  getIndex = (colNth, rowNth) => {
    return colNth + this.props.noCol * (rowNth - 1) - 1;
  }

  canvasRef = (nth) => (elem) => {
    this.canvases[nth] = elem;
  }

  render() {
    const { canvasProps } = this.state;
    const { src, hide, startingPoint, startingDirection, noCol, noRow, ...others } = this.props;
    return (
      <Relative {...others}>
        <img style={{ width: '100%', visibility: 'hidden' }} src={this.props.src} alt=""/>
        <Container
          style={{
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '100%'
          }}
        >
          {Array(noCol * noRow).fill(null).map((_, i) =>
            <CanvasContainer
              key={i}
              style={{
                width: `${1 / noCol * 100}%`,
                height: `${1 / noRow * 100}%`
              }}
              left={this.getNthCol(i) === 1}
              top={this.getNthRow(i) === 1}
              bottom={this.getNthRow(i) === noRow}
              right={this.getNthCol(i) === noCol}
              {...canvasProps[i]}
              >
              <Canvas
                left={this.getNthCol(i) === 1}
                top={this.getNthRow(i) === 1}
                bottom={this.getNthRow(i) === noRow}
                right={this.getNthCol(i) === noCol}
                innerRef={this.canvasRef(i)}
                style={{
                  width: '100%',
                  height: '100%'
                }}
                {...canvasProps[i]}
              />
            </CanvasContainer>
          )}
        </Container>
      </Relative>
    );
  }
}
