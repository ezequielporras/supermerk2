const CUIT = 30278205627;
const HOURVALUE = 200;
const ESTABLISHMENTCBU = "1234567891011316209650";

const list = () => {
    return fetch('/api/reports', {
        method: 'GET',
    }).then(response => {
        return response.json()
    }).catch((err) => console.log(err))
}

const getEmployeeUsers = () => {
    return fetch('/api/employee/', {
        method: 'GET',
    }).then(response => {
        return response.json()
    }).catch((err) => console.log(err))
}

const getEmployeeHours = (cuil) => {
    const currentDate = new Date();
    const sinceMonth = currentDate.getMonth() - 1;
    const sinceDate = `${currentDate.getFullYear().toString()}-${sinceMonth.toString()}-${currentDate.getDate().toString()}`;
    const untilDate = `${currentDate.getFullYear().toString()}-${currentDate.getMonth().toString()}-${currentDate.getDate().toString()}`;
    return fetch('https://presentismo-integrado.herokuapp.com/informarpresentismo', {
        method: 'GET',
        // body: {
        //     cuil: cuil,
        //     fechaInicio: sinceDate,
        //     fechaFin: untilDate
        // }
    }).then(response => {
        return response.json()
    }).catch((err) => console.log(err))
}

const processPayment = (body) => {
    return fetch('https://bank-back.herokuapp.com/api/v1/solicitudes/pago', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }).then((response) => {
        return response.json()
    }).catch((err) => console.log(err))
}


const buildAmount = (opt) => {
    const finalHours = opt.hours - (opt.aus * 8);
    return finalHours * HOURVALUE;
}


const getPresentismByEmployee = (cb) => {
    let employeeInfo = [];
    let buildPayments = new Promise((resolve, reject) => {
        getEmployeeUsers().then((data) => {
            const qtyUsers = data.length;
            data.forEach((item, index) => {
                const employee = getEmployeeHours(); //item.cuil
                employee.then(employeeData => {
                    employeeData && employeeInfo.push({
                        cbuDestino: item.cbu,
                        fechaDePago: new Date(),
                        descripcion: `Pago de haberes ${item.name}`,
                        monto: buildAmount({hours: employeeData.horasTrabajadas, aus: employeeData.ausencias})
                    })
                    if (index === qtyUsers - 1) resolve();
                })
            })
        })
    })

    buildPayments.then(() =>
        processPayment({cbuEstablecimiento: ESTABLISHMENTCBU, pagos: employeeInfo}).then(result => {
            cb('Los pagos se ejecutaron con exito');
        })
    )

}

const getPresentism = (cb) => {
    let employeeInfo = [];
    let runChain = new Promise((resolve, reject) => {
        getEmployeeUsers().then((data) => {
            const qtyUsers = data.length;
            data.forEach((item, index) => {
                const employee = getEmployeeHours(); //item.cuil
                employee.then(employeeData => {
                    employeeData && employeeInfo.push({
                        name: item.name,
                        hours: employeeData.horasTrabajadas,
                        aus: employeeData.ausencias,
                        amount: buildAmount({hours: employeeData.horasTrabajadas, aus: employeeData.ausencias}),
                    })
                    if (index === qtyUsers - 1) resolve();
                })
            })
        })
    })

    return runChain.then(() => cb(employeeInfo))

}


export {
    list,
    getPresentismByEmployee,
    getPresentism,
}
