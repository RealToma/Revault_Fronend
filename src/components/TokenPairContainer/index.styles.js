import styled from "styled-components";

export const Root = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-auto-rows: 330px;
  column-gap: 30px;
  row-gap: 30px;
  justify-content: center;
  width: 100%;
  max-width: 960px;
  padding-bottom: 60px;
`;
