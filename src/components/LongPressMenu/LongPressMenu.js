import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { white, yellow } from 'theme/variables';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  ${''/* background-color: ${white}; */}
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
`;

const Menu = styled.div`
  opacity: 1;
  height: 100%;

  pointer-events: none;
  transition: opacity .2s ease-in;
  ${ ({ close }) => close && css`
    opacity: 0;
  `}
`;

const Option = styled.div`
  width: 100%;
  height: 50%;
  background-color: red;
  border-bottom: 1px solid white;
  font-size: 2em;

  display: flex;
  align-content: center;
  justify-content: center;

  transition: background-color .2s ease-in;
  ${ ({ active }) => active && css`
    background-color: yellow;
  `}
`;

const Message = styled.h1`
  ${''/* position: fixed;
  z-index: 99; */}
`;

export default class LongPressNenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pressing: false,
      moving: false,
      message: '....11??',
      option1Active: false,
      option2Active: false
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
      // console.log(e.touches);
      // console.log(e.pageY);
      // console.log(e.changedTouches[0].pageY);
      this.setState({
        message: (e.changedTouches[0].clientY / window.innerHeight < 1/2) ?
          'Just click link 1':
          'Just click link 2'
      });
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

  onTouchMove = (e) => {
    this.setState({
      moving: true
    });
    const { pressing } = this.state;
    // this.setState({
    //   message: e.touches[0].pageY
    // });
    if (pressing) {
      e.preventDefault();
      this.adjustOptionsProps(e);
    }
  };

  adjustOptionsProps = (e) => {
    const pageY = (e.touches && e.touches.length) ?
      e.touches[0].clientY :
      e.changedTouches[0].clientY;

    if (pageY / window.innerHeight < 1/2) {
      this.setState({
        option1Active: true,
        option2Active: false
      });
    } else {
      this.setState({
        option1Active: false,
        option2Active: true
      });
    }
  }

  onLinkSelected = () => {
    this.setState({
      message: 'A Link is selected'
    });
  }

  render() {
    const {
      pressing,
      // moving,
      message,
      option1Active,
      option2Active
    } = this.state;

    return (
      <div>
        <Message>{message}</Message>
        <Container
          open={pressing}
          // onMouseDown={this.onTouchStart}
          // onMouseUp={this.onTouchEnd}
          // onMouseMove={this.onTouchMove}
          // onTouchEnd={this.onTouchEnd}
          // onTouchMove={this.onTouchMove}
          // onTouchStart={this.onTouchStart}
        >
            <Menu close={!pressing}>
              <Option active={option1Active}>Link1</Option>
              <Option active={option2Active}>Link2</Option>
            </Menu>
          </Container>
      </div>
    );
  }
}
