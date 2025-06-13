<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="UcEnderecosContato.ascx.cs" Inherits="EasyRoute.Uc.UcEnderecosContato" %>

<div class="modal fade" id="mdlEnderecosContato" tabindex="-1" role="dialog" data-backdrop="static">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">

            <div class="modal-header">
                <h3 style="color: whitesmoke;">Endereços</h3>
                <button type="button" class="btn btn-close-white fw-bold" data-dismiss="modal" aria-label="Close"><span></span>X</button>
            </div>

            <div class="modal-body">
                <div class="row mt-1" style="justify-content: center">
                    <div class="col-md-7">
                        <div class="form inicia-invisivel-form">
                            <div class="row endereco">
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label class="form-label">CEP</label>
                                        <div class="input-group endereco">
                                            <input type="text" id="txt_cep" class="form-control field-req field-req-cep" maxlength="9" />
                                            <button type="button" class="btn btn-primary" id="btn_pesquisar_cep" title="Insira um CEP e clique na lupa">
                                                <span class="input-group-addon">
                                                    <i class="fa fa-search"></i>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row endereco">
                                <div class="col-md-9">
                                    <div class="form-group">
                                        <label class="form-label">Logradouro</label>
                                        <input type="text" id="txt_logradouro" class="form-control field-req endereco" maxlength="200" />
                                    </div>
                                </div>

                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label class="form-label">Número</label>
                                        <input type="text" id="txt_numero" class="form-control field-req endereco" maxlength="6" />
                                    </div>
                                </div>
                            </div>

                            <div class="row endereco">
                                <div class="col-md-9">
                                    <div class="form-group">
                                        <label class="form-label">Bairro</label>
                                        <input type="text" id="txt_bairro" class="form-control field-req endereco" maxlength="60" />
                                    </div>
                                </div>

                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label class="form-label">Complemento</label>
                                        <input type="text" id="txt_complemento" class="form-control endereco" maxlength="60" />
                                    </div>
                                </div>
                            </div>

                            <div class="row endereco">
                                <div class="col-md-9">
                                    <div class="form-group">
                                        <label class="form-label">Cidade</label>
                                        <input type="text" id="txt_cidade" class="form-control field-req endereco" maxlength="60" />
                                    </div>
                                </div>

                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label class="form-label">Estado</label>
                                        <input type="text" id="txt_estado" class="form-control field-req endereco" maxlength="2" />
                                    </div>
                                </div>

                                <div class="mt-2">
                                    <button type="button" id="btn_inserir_endereco" class="btn btn-success pull-right">
                                        <span id="titulo_btn_inserir_endereco"></span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="row" style="justify-content: center">
                            <div class="col-md-2">
                                <button type="button" class="btn btn-primary" id="btn_inserir_novo_endereco">
                                    <i class="fa fa-plus" title="Inserir novo endereço"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="row mt-3">
                        <div class="col-lg-12">
                            <div id="divTbEnderecosContato" class="inicia-invisivel-table">
                                <table id="tbEnderecosContato" class="table table-sm table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th style="width: 20%;">Logradouro</th>
                                            <th style="width: 8%;">Número</th>
                                            <th style="width: 16%;">Bairro</th>
                                            <th style="width: 10%;">Complemento</th>
                                            <th style="width: 10%;">CEP</th>
                                            <th style="width: 20%;">Cidade</th>
                                            <th style="width: 8%;">Editar</th>
                                            <th style="width: 8%;">Excluir</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div id="pgEnderecosContato" class="paginacao"></div>
                </div>
            </div>
        </div>
    </div>
</div>
