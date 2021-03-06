import React, { Component } from 'react';
import styled from 'styled-components';
import { Motion, spring } from 'react-motion';
import media from 'theme/media';
import { black, white, gray, lightGray } from 'theme/variables';

// --------------Styles-----------------
const ImgContainer = styled.div`
  width: 400px;
  height: 200px;
  overflow: hidden;
  border: 5px solid ${black};
  ${media.tablet`
    width: 100%;
  `}
`;

const Image = styled.img`
  height: 100%;
`;

const Rectangle = styled.div`
  margin-top: 25px;

  width: 150px;
  height: 20px;
  border: 1px solid ${lightGray};
`;
const InnerRectangle = styled.div`
  margin-top: -1px;
  margin-left: -1px;

  height: 20px;
  width: 20px;
  border: 1px solid ${black};
  background-color: ${white};
`;

// -----------Helpers------------------

const between = function between(a, b) {
  const min = a < b ? a : b;
  const max = a < b ? b : a;
  return (val) => Math.min(max, Math.max(val, min));
}

// --------------Component-----------------
export default class RollableImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageWidth: null,
      mousePositionRatio: 0,
      landscape: false,
      k: 0
    };
  }

  componentDidMount() {
    this.handleOrientation();
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('devicemotion', this.handleAcceleration);
    window.addEventListener('orientationchange', this.handleOrientation);
    window.addEventListener('resize', this.onWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('devicemotion', this.handleAcceleration);
    window.removeEventListener('orientationchange', this.handleOrientation);
    window.removeEventListener('resize', this.onWindowResize);
  }

  handleOrientation = (event) => {
    const { orientation } = window;
    const { imageWidth, k } = this.state;
    this.setState({
      landscape: orientation === 90 || orientation === -90,
      k: imageWidth ? (imageWidth - this.container.offsetWidth) / 2 : k
    });
  }

  onWindowResize = () => {
    const { imageWidth, k } = this.state;
    this.setState({
      k: imageWidth ? (imageWidth - this.container.offsetWidth) / 2 : k
    });
  }

  onMouseMove = ({ screenX }) => {
    const screenWidth = window.innerWidth;
    const mousePositionRatio = (screenX - screenWidth / 2) / (screenWidth / 2);
    this.setState({
      mousePositionRatio
    });
  }

  handleAcceleration = ({ accelerationIncludingGravity: { x, y } }) => {
    const { landscape } = this.state;
    this.setState({
      mousePositionRatio: (landscape ? y : x) / 4,
    });
  }

  onImageLoad = ({ target }) => {
    const imageWidth = target.clientWidth;
    this.setState({
      imageWidth,
      k: (imageWidth - this.container.offsetWidth) / 2
    });
  }

  render() {
    const { mousePositionRatio, k } = this.state;

    return (
      <div>
        <ImgContainer innerRef={(elem) => this.container = elem}>
          <Motion style={{ x: spring(mousePositionRatio) }}>
            {({ x }) =>
              <Image
                style={{
                  transform: `translate(${-k + k * between(-1, 1)(-x) - 1}px, 0)`
                }}
                onLoad={this.onImageLoad}
                src={require("assets/view.png")}
                alt="creative-word"
              />
            }
          </Motion>
        </ImgContainer>
        <Rectangle>
          <Motion style={{ x: spring(mousePositionRatio) }}>
            {({ x }) =>
              <InnerRectangle
                style={{
                  marginLeft: `${(between(-1, 1)(x) + 1) * 100 * 130 / 150 / 2}%`
                }}
              />
            }
          </Motion>
        </Rectangle>
        <p><small>Picture from unsplash.com</small></p>
      </div>
    );
  }
}
