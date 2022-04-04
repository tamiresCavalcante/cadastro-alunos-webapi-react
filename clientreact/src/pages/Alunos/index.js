import React from "react";
import { Link } from 'react-router-dom';
import './styles.css';
import { AiTwotoneSnippets } from "react-icons/ai";
import {FiXCircle, FiEdit, FiUserX} from 'react-icons/fi';

export default function Alunos(){
    return (
        <div className="aluno-container">
            <header>
                <AiTwotoneSnippets fontSize={"50px"} />
                <span>Bem-vindo, !</span>
                <Link className="button" to="aluno/novo">Novo Aluno</Link>
                <button type="button">
                    <FiXCircle size={35} color="#17202a" />
                </button>
            </header>
            <form>
                <input type='text' placeholder='Nome' />
                <button type="button" class="button">
                    Filtrar aluno por nome
                </button>
            </form>
            <h1>Relação de Alunos</h1>
            <ul>
                <li>

                </li>
            </ul>
        </div>
    )
}