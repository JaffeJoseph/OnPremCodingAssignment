import joi from 'joi';
import * as db from './db';

const model = {
    employee: {
        fullName: joi.string(),
        DOB: joi.string(),
        role: joi.string()
    },
    id: {
        id: joi.string().length(36)
    }
}

const getEmployees = {
    method: 'GET',
    path: '/employees',
    handler: (req, reply) => {
        reply(db.getEmployees());
    }
};

const addEmployee = {
    method: 'POST',
    path: '/employees',
    handler: ({payload: employee}, reply) => {
        reply(db.addEmployee(employee)).code(201);
    },
    config: {
        validate: {
            payload: model.employee
        }
    }
};

const editEmployee = {
    method: 'PATCH',
    path: '/employees/{id}',
    handler: ({params, payload}, reply) => {
        reply(db.editEmployee(params.id, payload)).code(202);
    },
    config: {
        validate: {
            params: model.id,
            payload: model.employee
        }
    }
};

const replaceEmployee = {
    method: 'PUT',
    path: '/employees/{id}',
    handler: ({params, payload}, reply) => {
        reply(db.editEmployee(params.id, payload)).code(202);
    },
    config: {
        validate: {
            params: model.id,
            payload: model.employee
        }
    }
};

const removeEmployee = {
    method: 'DELETE',
    path: '/employees/{id}',
    handler: ({params: {id}}, reply) => {
        reply(db.removeEmployee(id)).code(204);
    },
    config: {
        validate: {
            params: model.id
        }
    }
};

const clientDir = {
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: 'client'
        }
    }
};

const index = {
    method: 'GET',
    path: '/',
    handler: {
        file: 'client/index.html'
    }
};

export default [
    getEmployees,
    addEmployee,
    editEmployee,
    removeEmployee,
    replaceEmployee,
    clientDir,
    index
];
