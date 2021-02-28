import { Produtos } from './produtos-data.model';
export interface CartModelServer {
    total: number,
    data: [{
        produto: Produtos,
        quantidadeEmCarrinho: number
    }];
}


export interface CartModelPublic {
    total: number,
    produtoData: [{
        id: number,
        noCarrinho: number
    }]
}