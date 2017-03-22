import React, { Component } from 'react';
import styled, { css } from 'styled-components';

const Container = styled.div`
  width: 400px;
  height: 250px;
  position: relative;
`;

const producePolygon = ({ x, y, w, h }) => {
  return `polygon(${x}% ${y}%, ${x + w}% ${y}%, ${x + w}% ${y + h}%, ${x}% ${y + h}%)`;
}

const Piece1 = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  background-image: url(${require('assets/portrait.jpg')});
  background-size: cover;
  pointer-events: none;

  transition: transform .2s;

  z-index: 0;
  clip-path: ${producePolygon({ x: 0, y: 0, w: 80, h: 70 })};
`;
const Piece2 = styled(Piece1)`
  clip-path: ${producePolygon({ x: 80, y: 0, w: 20, h: 60 })};
  z-index: 1;
  transform: translate(0, 0);
  ${({ step }) => step >= 1 && css`
    transform: translate(0, 10%);
  `}
`;
const Piece3 = styled(Piece1)`
  clip-path: ${producePolygon({ x: 80, y: 59.9, w: 20, h: 40 })};
  z-index: 4;

  transform: translate(0, 0);
  ${({ step }) => step === 1 && css`
    transform: translate(0, 10%);
  `}
  ${({ step }) => step === 2 && css`
    transform: translate(-10%, 10%);
  `}
`;
const Piece4 = styled(Piece1)`
  clip-path: ${producePolygon({ x: 0, y: 69.9, w: 100, h: 30 })};
  z-index: 3;
  ${({ step }) => step === 2 && css`
    transform: translate(-10%, 0);
  `}
`;

export default class WeirdImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 2
    };
  }

  onMouseLeave = () => {
    if (this.timeout) clearTimeout(this.timeout);
    this.setState({
      step: 1
    });
    this.timeout = setTimeout(() => {
      this.setState({
        step: 2
      });
    }, 150);
  }

  onMouseOver = () => {
    if (this.timeout) clearTimeout(this.timeout);
    if (this.state.step === 2) {
      this.setState({
        step: 1
      });
      this.timeout = setTimeout(() => {
        this.setState({
          step: 0
        });
      }, 150);
    } else {
      this.setState({
        step: 0
      });
    }
  }

  render() {
    const { step } = this.state;
    return (
      <div>
        <Container
          onMouseLeave={this.onMouseLeave}
          onMouseOver={this.onMouseOver}>
          <Piece1 step={step}></Piece1>
          <Piece2 step={step}></Piece2>
          <Piece3 step={step}></Piece3>
          <Piece4 step={step}></Piece4>
        </Container>
      </div>
    );
  }
}
