import { injectGlobal } from 'styled-components';
import { gray, black, yellow, white } from './variables';

injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=VT323');
  body {
    background-color: ${yellow};
    ${''/* background: url(${require('assets/soft_kill.png')}) repeat; */}
    color: ${gray};
    font-family: 'VT323', monospace;
  }

  hr {
    border: 1px solid ${black};
  }

  button, a {
    color: ${gray};
    font-family: 'VT323', monospace;
  }
`;
