import { injectGlobal } from 'styled-components';
import { gray, black, yellow, white } from './variables';

injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=VT323');
  body {
    background-color: ${gray};
    background: url(${require('assets/soft_kill.png')}) repeat;
    color: ${yellow};
    font-family: 'VT323', monospace;
  }

  button, a {
    color: ${white};
    font-family: 'VT323', monospace;
  }
`;
