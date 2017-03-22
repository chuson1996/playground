import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { white, blue, yellow, red } from 'theme/variables';
import { Motion, spring } from 'react-motion';

const easingFunction = 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  ${''/* background-color: ${white}; */}
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 98;
`;

const Menu = styled.div`
  height: 100%;
  pointer-events: none;

  ${''/* opacity: 1; */}
  transform: skewX(0deg) translate(0, 0);
  transition: transform .5s ${easingFunction}, opacity .2s ${easingFunction};
  ${ ({ close }) => close && css`
    transform: skewX(-20deg) translate(-140%, 0);
    ${''/* opacity: 0; */}
  `}
`;

const Option = styled.div`
  width: 100%;
  height: 20%;
  ${''/* border-bottom: 1px solid ${white}; */}
  font-size: 2em;
  text-align: center;

  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;

  background-color: ${red};
  transition: background-color .2s ease-in;
  ${ ({ active }) => active && css`
    background-color: ${yellow};
  `}
`;

const Message = styled.h1`
  ${''/* position: fixed;
  z-index: 99; */}
`;

const Circle = styled.div`
  position: fixed;
  z-index: 99;
  opacity: 0.4;
  background-color: ${blue};
  width: 150px;
  height: 150px;
  border-radius: 50%;
  top: 0;
  left: 0;

  transform: translate(-50%, -50%) scale(1);
  transition: transform .3s ${easingFunction};
  ${ ({ hide }) => hide && css`
    transform: translate(-50%, -50%) scale(0);
  `}
`;

// ------------ Component ------------------
// -----------------------------------------

export default class LongPressNenu extends Component {
  constructor(props) {
    super(props);
    this.options = {};
    this.state = {
      pressing: false,
      moving: false,
      message: `Haven't picked anything yet.`,
      activeOption: null,
      mousePosition: { x: null, y: null }
    };
  }

  componentDidMount() {
    window.addEventListener('touchstart', this.onTouchStart);
    window.addEventListener('touchend', this.onTouchEnd);
    window.addEventListener('touchmove', this.onTouchMove);
  }

  onTouchStart = (e) => {
    this.adjustOptionsProps(e);
    this.timeout = setTimeout(() => {
      const { moving } = this.state;
      if (!moving) {
        this.setState({
          pressing: true
        });
      }
    }, 500);
  };

  onTouchEnd = (e) => {
    if (this.state.pressing) {
      const { clientY } = e.changedTouches[0];
      for (const key of Object.keys(this.options)) {
        const elem = this.options[key];
        if (this.isOptionSelected(elem, { clientY })) {
          this.setState({
            message: `Just selected ${key}`
          });
          break;
        }
      }
    }
    this.setState({
      pressing: false,
      moving: false,
      // message: e.target.textContent
    });

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  };

  moveCircle = ({ clientX, clientY }) => {
    this.setState({
      mousePosition: {
        x: clientX,
        y: clientY,
      }
    });
  }

  onTouchMove = (e) => {
    this.setState({
      moving: true
    });
    const { pressing } = this.state;
    if (pressing) {
      e.preventDefault();
      this.adjustOptionsProps(e);
    }
  };

  adjustOptionsProps = (e) => {
    const { clientY, clientX } = (e.touches && e.touches.length) ?
      e.touches[0] : e.changedTouches[0];

    this.moveCircle({ clientX, clientY });

    Object.keys(this.options).forEach((key) => {
      const elem = this.options[key];
      if (this.isOptionSelected(elem, { clientY })) {
        this.setState({
          activeOption: key
        })
      }
    })
  }

  isOptionSelected(elem, mousePosition) {
    const { top, height } = elem.getBoundingClientRect();
    const { clientY } = mousePosition;
    return clientY > top && clientY < top + height;
  }

  registerOption = (key) => (elem) => {
    this.options[key] = elem;
  }

  render() {
    const {
      pressing,
      // moving,
      message,
      // option1Active,
      // option2Active,
      activeOption,
      mousePosition,
    } = this.state;

    const preset = {
      stiffness: 163,
      damping: 15
    };

    return (
      <div>
        <Message>{message}</Message>
        <Motion
          style={{
            x: spring(mousePosition.x, preset),
            y: spring(mousePosition.y, preset)
          }}>
            {({ x, y }) =>
              <Circle
                hide={!pressing}
                style={{
                  top: y,
                  left: x
                }}/>
            }
          </Motion>
        <Container
          open={pressing}
        >
          <Menu close={!pressing}>
            <Option
              innerRef={this.registerOption('link1')}
              active={activeOption === 'link1'}>Link1</Option>
            <Option
              innerRef={this.registerOption('link2')}
              active={activeOption === 'link2'}>Link2</Option>
            <Option
              innerRef={this.registerOption('link3')}
              active={activeOption === 'link3'}>Link3</Option>
            <Option
              innerRef={this.registerOption('link4')}
              active={activeOption === 'link4'}>Link4</Option>
            <Option
              innerRef={this.registerOption('link5')}
              active={activeOption === 'link5'}>Link5</Option>
          </Menu>
        </Container>
      </div>
    );
  }
}
