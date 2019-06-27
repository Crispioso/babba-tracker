import * as React from 'react'
import Paper from '@material-ui/core/Paper'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import withFirebase, {
  FirebaseFunctionProps,
  FirebaseData,
} from '../firebase/withFirebase'

type Props = FirebaseFunctionProps & FirebaseData

const Wrapper = styled.div`
  background-color: #fff;
  padding: 1rem 0.5rem;
  color: rgba(0, 0, 0, 0.87);
`

class Summary extends React.Component<Props, {}> {
  render() {
    return (
      // <Paper
      //   style={{ padding: '1rem', marginTop: '1rem', marginBottom: '1rem' }}
      // >
      <Wrapper>
        <Typography variant="body1" component="p">
          *Time* since evelyn last ate
        </Typography>
      </Wrapper>
      // </Paper>
    )
  }
}

export default withFirebase()(Summary)
