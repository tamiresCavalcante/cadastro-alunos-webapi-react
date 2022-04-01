import './App.css';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function App() {
  const baseUrl="https://localhost:44352/api/alunos";
  const [data, setData] = useState([]);
  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [updateData, setUpdateData] = useState(true);

  const [alunoSelecionado, setAlunoSelecionado] = useState({
    id:'',
    nome: '',
    email: '',
    idade: ''
  })

  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir);
  }

  const abrirFecharModalEditar = () => {
    setModalEditar(!modalEditar);
  }

  const abrirFecharModalExcluir = () => {
    setModalExcluir(!modalExcluir);
  }

  const selecionarAluno = (aluno, opcao) => {
    setAlunoSelecionado(aluno);
    (opcao === "Editar") ? 
      abrirFecharModalEditar() : abrirFecharModalExcluir();
  }

  const handleChange = e => {
    const {name, value} = e.target;
    setAlunoSelecionado({
      ...alunoSelecionado,
      [name]: value
    });
    console.log(alunoSelecionado);
  }

  const pedidoGet = async() => {
    console.log(baseUrl);
    await axios.get(baseUrl)
    .then(response => {
      setData(response.data);
      setUpdateData(true);
    }).catch(error => {
      console.log(error);
    })
  }

  const pedidoPost = async() => {
    delete alunoSelecionado.id;
    alunoSelecionado.idade = parseInt(alunoSelecionado.idade);
      await axios.post(baseUrl, alunoSelecionado)
      .then(response => {
        setData(data.concat(response.data));
        setUpdateData(true);
        abrirFecharModalIncluir();
      }).catch(error => {
        console.log(error);
      })
  }

  const pedidoPut = async() => {
    alunoSelecionado.idade = parseInt(alunoSelecionado.idade);
    await axios.put(baseUrl+"/"+alunoSelecionado.id, alunoSelecionado)
    .then(response => {
      var resposta = response.data;
      var dadosAuxiliar = data;
      dadosAuxiliar.map(aluno => {
        if(aluno.id === alunoSelecionado.id){
          aluno.nome = resposta.nome;
          aluno.email = resposta.email;
          aluno.idade = resposta.idade;
        }
      });
      setUpdateData(true);
      abrirFecharModalEditar();
    }).catch(error => {
      console.log(error);
    })
  }

  const pedidoDelete = async() => {
    await axios.delete(baseUrl+"/"+alunoSelecionado.id)
    .then(response => {
      setData(data.filter(aluno => aluno.id !== response.data));
      setUpdateData(true);
      abrirFecharModalExcluir();
    }).catch(error => {
      console.log(error);
    })
  }

  useEffect(() => {
    if(updateData){
      pedidoGet();
      setUpdateData(false);
    }
  }, [updateData])

  return (
    <div className="App">
      <h3>Cadastro de Alunos</h3>
      <header>
        <button className="addaluno" onClick={() => abrirFecharModalIncluir()}>Incluir novo aluno</button>
      </header>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Idade</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
          {data.map(aluno => (
            <tr key={aluno.id}>
              <td>{aluno.id}</td>
              <td>{aluno.nome}</td>
              <td>{aluno.email}</td>
              <td>{aluno.idade}</td>
              <td>
                <button className="btn btn-primary" onClick={() => selecionarAluno(aluno, "Editar")} >Editar</button> {" "}
                <button className="btn btn-danger" onClick={() => selecionarAluno(aluno, "Excluir")}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="incluirAluno" isOpen={modalIncluir}>
        <h2>Incluir Alunos</h2>
        <div clasName="form-group">
            <label>Nome: </label>
            <input 
              type="text" 
              className="form-control" 
              name="nome" 
              onChange={handleChange} />
            <label>Email: </label>
            <input 
              type="text" 
              className="form-control" 
              name="email" 
              onChange={handleChange} />
            <label>Idade: </label>
            <input 
              type="text" 
              className="form-control" 
              name="idade" 
              onChange={handleChange} />
            <button className="btn btn-primary" onClick={() => pedidoPost()}>Incluir</button> {" "}
            <button className="btn btn-danger">Cancelar</button>
        </div>

      </div>

      <div className="editarAluno" isOpen={modalEditar}>
        <h2>Editar Aluno:</h2>
        <div clasName="form-group">
            <label>ID: </label>
            <input 
              type="text" 
              className="form-control" 
              readOnly
              value={alunoSelecionado && alunoSelecionado.id} 
            />
            <label>Nome: </label>
            <input 
              type="text" 
              className="form-control" 
              name="nome" 
              onChange={handleChange}
              value={alunoSelecionado && alunoSelecionado.nome}
            />
            <label>Email: </label>
            <input 
              type="text" 
              className="form-control" 
              name="email" 
              onChange={handleChange} 
              value={alunoSelecionado && alunoSelecionado.email}
            />
            <label>Idade: </label>
            <input 
              type="text" 
              className="form-control" 
              name="idade" 
              onChange={handleChange} 
              value={alunoSelecionado && alunoSelecionado.idade}
            />
            <button className="btn btn-primary" onClick={() => pedidoPut()}>Editar</button> {" "}
            <button className="btn btn-danger" onClick={() => abrirFecharModalEditar()}>Cancelar</button>
        </div>
      </div>

      <div isOpen={modalExcluir} className="modal-confirmacao">
        <h3>Confirmar exclusão deste aluno: {alunoSelecionado && alunoSelecionado.nome} ?</h3>
        <button className="btn btn-danger" onClick={() => pedidoDelete()}>Sim</button>
        <button className="btn btn-secondary" onClick={() => abrirFecharModalExcluir()}>Não</button>
      </div>
    </div>
  );
}

export default App;
