import { Materia } from './Materia'
import { Serie } from './enums/Serie'
import { Alternativa } from './Alternativa'

export class Questao {
    id: number | undefined;
	materia: Materia = new Materia();
	serie: Serie | undefined;
	nomeQuestao: string | undefined;
	textoQuestao: string | undefined;
    alternativas: Array<Alternativa> = new Array<Alternativa>();

    constructor(){

    }
}