import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import {list} from './api-reports.js'
import Table from 'material-ui/Table/Table';
import TableBody from 'material-ui/Table/TableBody';
import TableCell from 'material-ui/Table/TableCell';
import TableHead from 'material-ui/Table/TableHead';
import TableRow from 'material-ui/Table/TableRow';
import sortBy from 'lodash.sortby';
import groupBy from 'lodash.groupby';
import Button from 'material-ui/Button';

const CustomTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const styles = theme => ({
    root: {
        display: 'flex',
        overflowX: 'auto',
        flexWrap: 'wrap',
        marginRight: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * 3
    },
    table: {
        width: '50%',
        margin: '24px'
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
    title: {
        margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
        color: theme.palette.openTitle
    },
    button: {
        //margin: theme.spacing.unit,
        padding: '25px',
        fontSize: '24px',
    },
    totals: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        margin: '0 auto',
    },
});


class Reports extends Component {
    state = {
        items: []
    }

    componentDidMount() {
        list().then((data) => {
            if (data.error) {
                console.log(data.error)
            } else {
                // const payeds = data.filter(item => item._id.payment_status = 'Pagado');
                const byStatus = groupBy(data, '_id.payment_status');
                const totalPayed = byStatus.Pagado.reduce((a, b) => {
                    return a + (b.totalPrice)
                }, 0);

                const totalPending = byStatus.Pendiente.reduce((a, b) => {
                    return a + (b.totalPrice)
                }, 0);

                this.setState({
                    items: sortBy(data, [function (o) {
                        return o._id.payment_status;
                    }]),
                    totalPayed,
                    totalPending
                })
            }
        })
    }

    render() {
        const {classes} = this.props
        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell>Metodo de pago</CustomTableCell>
                            <CustomTableCell>Estado</CustomTableCell>
                            <CustomTableCell numeric>Total</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.items.map(n => {
                            return (
                                <TableRow className={classes.row} key={n.id}>
                                    <CustomTableCell component="th" scope="row">
                                        {n._id.payment_method}
                                    </CustomTableCell>
                                    <CustomTableCell>{n._id.payment_status}</CustomTableCell>
                                    <CustomTableCell numeric>$ {n.totalPrice}</CustomTableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                <div className={classes.totals}>
                <Button variant="raised" color="primary" className={classes.button} style={{ backgroundColor: '#4caf50' }}>
                   Cobrado $ {this.state.totalPayed}
                </Button>
                <Button variant="raised" color="primary" className={classes.button} style={{ backgroundColor: '#FFC107' }}>
                    Por cobrar $ {this.state.totalPending}
                </Button>
                </div>
            </Paper>
        );
    }
}

Reports.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Reports)

