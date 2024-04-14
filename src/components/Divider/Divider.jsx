import styled from "styled-components";

import { colorGrayscaleBody } from "../../colors";

const Divider = styled.span`
  transform: rotate(180deg);
  height: 2.5rem;
  border: 1px solid ${colorGrayscaleBody};
`;

export default Divider;
