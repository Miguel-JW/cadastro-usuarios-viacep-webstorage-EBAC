const CAMPOS = ['nome', 'email', 'cep', 'logradouro', 'bairro',
                'numero', 'cidade', 'uf', 'complemento'];

// Restaura dados do localStorage ao carregar a página
function restaurarDados() {
  CAMPOS.forEach(id => {
    const valor = localStorage.getItem(id);
    if (valor) document.getElementById(id).value = valor;
  });
}

// Salva todos os campos no localStorage
function salvarDados() {
  CAMPOS.forEach(id => {
    localStorage.setItem(id, document.getElementById(id).value);
  });
}

// Limpa formulário e localStorage
function limparDados() {
  CAMPOS.forEach(id => {
    document.getElementById(id).value = '';
    localStorage.removeItem(id);
  });
  document.getElementById('mensagem').textContent = '';
  document.getElementById('cep-status').textContent = '';
}

// Busca endereço na API ViaCEP
async function buscarCep(cep) {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length !== 8) return;

  const status = document.getElementById('cep-status');
  status.textContent = '🔍 Buscando...';
  status.className = '';

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const dados = await response.json();

    if (dados.erro) {
      status.textContent = '❌ CEP não encontrado';
      status.className = 'erro';
      return;
    }

    document.getElementById('logradouro').value = dados.logradouro || '';
    document.getElementById('bairro').value     = dados.bairro     || '';
    document.getElementById('cidade').value     = dados.localidade || '';
    document.getElementById('uf').value         = dados.uf         || '';

    status.textContent = '✅ Endereço encontrado';
    status.className = 'sucesso';

    salvarDados();
    document.getElementById('numero').focus();

  } catch {
    status.textContent = '❌ Erro ao buscar CEP';
    status.className = 'erro';
  }
}

// Máscara de CEP
document.getElementById('cep').addEventListener('input', function () {
  let valor = this.value.replace(/\D/g, '');
  if (valor.length > 5) valor = valor.slice(0, 5) + '-' + valor.slice(5, 8);
  this.value = valor;

  if (valor.replace(/\D/g, '').length === 8) buscarCep(valor);

  salvarDados();
});

// Salva no localStorage ao digitar em qualquer campo
CAMPOS.forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', salvarDados);
});

// Submit
document.getElementById('formCadastro').addEventListener('submit', function (e) {
  e.preventDefault();
  salvarDados();
  const msg = document.getElementById('mensagem');
  msg.textContent = '✅ Dados salvos com sucesso!';
  msg.className = 'sucesso';
});

// Limpar
document.getElementById('btnLimpar').addEventListener('click', limparDados);

// Restaura ao carregar
restaurarDados();
