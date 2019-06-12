import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import List, {ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import Typography from 'material-ui/Typography'
import ArrowForward from 'material-ui-icons/ArrowForward'
import Money from 'material-ui-icons/AttachMoney'
import {Link} from 'react-router-dom'
import {list} from './api-reports.js'

const styles = theme => ({
  root: theme.mixins.gutters({
    padding: theme.spacing.unit,
    margin: theme.spacing.unit * 5
  }),
  title: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
    color: theme.palette.openTitle
  }
})

class Reports extends Component {
  state = {
      items: []
  }

  componentDidMount() {
    list().then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {

        this.setState({items: data})
      }
    })
  }

  render() {
    const {classes} = this.props
    return (
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          Patrimonio por metodo y estado de pago.
        </Typography>
        <List dense>
         {this.state.items.map((item, i) => {
          return <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <Money/>
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={item.totalPrice}/>
                      <ListItemText primary={`${item._id.payment_method} - ${item._id.payment_status}`}/>
                    </ListItem>
               })
             }
        </List>
      </Paper>
    )
  }
}

Reports.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Reports)
