import './App.css';
import React from 'react';
import {Col, Input, Row, Select, Space, Table} from 'antd';
import axios from 'axios';

const Search = Input.Search;
const api_url = ' http://127.0.0.1:8000/';
const api_url_division_list = api_url + 'api/division';

export default class App extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            items: [],
            param_columnas: '',
            param_texto: ''
        };
    }

    componentDidMount() {
        this.api_load_list();
    }

    api_load_list() {
        const {param_texto, param_columnas} = this.state;

        let data = {
            p_search: param_texto,
            p_columna: param_columnas
        };

        axios.get(api_url_division_list, {
            params: data,
        }).then(response => {
            let items = response.data;

            let a_divi_Nombre = [];
            let a_divi_Nivel = [];
            let a_disu_Nombre = [];

            items.forEach((item) => {
                let divi_Nombre = item.divi_Nombre;
                if (a_divi_Nombre.indexOf(divi_Nombre) < 0) {
                    a_divi_Nombre.push(divi_Nombre);
                }

                let divi_Nivel = item.divi_Nivel;
                if (a_divi_Nivel.indexOf(divi_Nivel) < 0) {
                    a_divi_Nivel.push(divi_Nivel);
                }

                let disu_Nombre = item.disu_Nombre;
                if (a_disu_Nombre.indexOf(disu_Nombre) < 0) {
                    a_disu_Nombre.push(disu_Nombre);
                }
            });

            const f_divi_Nombre = a_divi_Nombre.map(item => {
                return {text: item, value: item};
            });

            const f_divi_Nivel = a_divi_Nivel.map(item => {
                return {text: item, value: item};
            });

            const f_disu_Nombre = a_disu_Nombre.map(item => {
                return {text: item, value: item};
            });

            this.setState({items, f_divi_Nombre, f_divi_Nivel, f_disu_Nombre});
        })
    }

    fun_buscar(value) {
        console.log(`BUSCAR ${value}`);

        // BUSQUEDA POR TEXTO
        this.setState({param_texto: value});
    };

    fun_seleccionar(value) {
        console.log(`ELEMENTOS SELECCIONADOS ${value}`);
        // BUSQUEDA POR COLUMNA
        this.setState({param_columnas: value});
    };

    fun_editar(value) {
        console.log(`EDITAR A  ${value.divi_Nombre}`);
    };


    fun_eliminar(value) {
        console.log(`ELIMINAR A  ${value.divi_Nombre}`);
    };


    render() {

        const {items, f_divi_Nombre, f_divi_Nivel, f_disu_Nombre} = this.state;

        const columns = [
            {
                title: 'DIVISIÓN',
                dataIndex: 'divi_Nombre',
                key: 'divi_Nombre',
                sorter: (a, b) => a.divi_Nombre.localeCompare(b.divi_Nombre),
                filters: f_divi_Nombre,
                filterSearch: true,
                onFilter: (value, record) => record.divi_Nombre.includes(value),
            },
            {
                title: 'DIVISIÓN SUPERIOR',
                dataIndex: 'disu_Nombre',
                key: 'disu_Nombre',
                sorter: (a, b) => a.disu_Nombre.localeCompare(b.disu_Nombre),
                filters: f_disu_Nombre,
                filterSearch: true,
                onFilter: (value, record) => record.disu_Nombre.includes(value),
            },
            {
                title: 'COLABORADORES',
                dataIndex: 'divi_Colaborador_Cantidad',
                key: 'divi_Colaborador_Cantidad',
                sorter: (a, b) => a.divi_Colaborador_Cantidad - b.divi_Colaborador_Cantidad,
            },
            {
                title: 'NIVEL',
                dataIndex: 'divi_Nivel',
                key: 'divi_Nivel',
                sorter: (a, b) => a.divi_Nivel - b.divi_Nivel,
                filters: f_divi_Nivel,
                filterSearch: true,
                onFilter: (value, record) => record.divi_Nivel === value,
            },
            {
                title: 'SUB-DIVISIONES',
                dataIndex: 'divi_Sub_Divisiones',
                key: 'divi_Sub_Divisiones',
                sorter: (a, b) => a.divi_Sub_Divisiones - b.divi_Sub_Divisiones,
                render: (_, recordx) => (
                    <Space size="middle">
                        {recordx.divi_Sub_Divisiones} <button>+</button>
                    </Space>
                )
            },
            {
                title: 'EMBAJADORES',
                dataIndex: 'divi_Embajador_Nombre',
                key: 'divi_Embajador_Nombre',
            },

            {
                title: 'OPT',
                key: 'opt',
                render: (_, record) => (
                    <Space size="middle">
                        <button onClick={() => this.fun_editar(record)}>EDITAR</button>
                        <button onClick={() => this.fun_eliminar(record)}>ELIMINAR</button>
                    </Space>
                )
            }
        ];

        const options = [
            {
                label: 'DIVISIÓN',
                value: 'd.divi_Nombre',
            }, {
                label: 'DIVISIÓN SUPERIOR',
                value: 'ds.divi_Nombre',
            }, {
                label: 'COLABORADORES',
                value: 'd.divi_Colaborador_Cantidad',
            }, {
                label: 'NIVEL',
                value: 'd.divi_Nivel',
            }, {
                label: 'EMBAJADORES',
                value: 'd.divi_Embajador_Nombre',
            }
        ];


        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`ELEMENTOS SELECCIONADOS EN TABLA ${selectedRowKeys}`, 'DATA: ', selectedRows);
            }
        };


        // const [param_texto, set_param_texto] = useState('');
        // const [param_columnas, set_param_columnas] = useState('');

        return (

            <div className="App">
                <header className="App-header">
                    <h1>Reto Técnico Mandü</h1>
                    <div className="container">
                        tiene como objetivo medir tus capacidades como desarrollador frontend y backend, para lo cual
                        debes
                        construir el prototipo del módulo de Divisiones de una organización
                    </div>


                    <Row justify="center">
                        <Col>

                            <Select
                                mode="multiple"
                                allowClear
                                placeholder="COLUMNAS"
                                style={{
                                    width: '200px',
                                    margin: '1.5em'
                                }}
                                onChange={(e) => this.fun_seleccionar(e)}
                                options={options}
                            />

                        </Col>
                        <Col>

                            <Search placeholder="Buscar..."
                                    enterButton="BUSCAR"
                                    style={{
                                        width: '350px',
                                        margin: '1.5em'
                                    }}
                                    onChange={(e) => this.fun_buscar(e.target.value)}
                                    onSearch={() => this.api_load_list()}

                            />

                        </Col>
                    </Row>


                    <Table
                        className="table-main"
                        rowKey="divi_IdDivision"
                        dataSource={items}
                        columns={columns}
                        rowSelection={{
                            type: 'checkbox',
                            ...rowSelection,
                        }}
                        pagination={{
                            defaultPageSize: 10,
                            showSizeChanger: true,
                            position: ['bottomCenter'],
                            showTotal: (total) => `Total colaboradores: ${total}`,
                            pageSizeOptions: ['10', '20', '30', '60']
                        }}
                    />

                </header>
            </div>
        );
    }

}
