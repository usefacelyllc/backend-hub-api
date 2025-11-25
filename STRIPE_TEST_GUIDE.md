# Guia: Como Testar Transações no Stripe (Dashboard)

Atualmente, sua configuração está enviando transações para o **Test Gateway do Recurly** ou você tem o Stripe em **Modo Live** (Produção), o que impede testes com cartões fictícios no dashboard do Stripe.

Para ver as transações chegando no **Dashboard do Stripe**, siga estes passos:

## 1. Configurar Stripe em Modo de Teste (Sandbox)

O "Stripe Configuration Test" que você mostrou está em **Live Mode: True**. Para testes, precisamos do **Test Mode**.

1. **Acesse o Recurly Admin** > **Configuration** > **Payment Gateways**.
2. Se já existir um gateway Stripe "Live", **não o use para testes** com cartões falsos.
3. Adicione um **novo gateway** (ou edite o existente se ainda não estiver em produção):
   - Clique em **Add Gateway**.
   - Escolha **Stripe**.
   - **IMPORTANTE**: Na configuração, procure a opção de **Test Mode** ou use suas chaves de teste do Stripe (`sk_test_...` e `pk_test_...`).
   - Se conectar via OAuth (botão "Connect with Stripe"), certifique-se de selecionar a conta e pular o formulário de ativação ou selecionar "Test Mode" se perguntado.

## 2. Definir Stripe de Teste como Padrão

1. Na lista de Payment Gateways, encontre o gateway **Stripe (Test)** que você acabou de configurar.
2. Clique nos três pontinhos (...) ou na engrenagem e selecione **Make Default**.
3. Isso garante que o Recurly tente enviar as transações para este gateway.

## 3. Usar Cartões de Teste do Stripe

Para que a transação seja aceita pelo Stripe e apareça no dashboard:

- **Número**: `4242 4242 4242 4242` (Visa) ou `4000 0000 0000 0002` (Mastercard)
- **Validade**: Qualquer data futura
- **CVC**: Qualquer 3 dígitos (ex: 123)
- **CEP**: Qualquer um válido (ex: 12345)

## 4. Verificar no Dashboard do Stripe

1. Acesse [dashboard.stripe.com](https://dashboard.stripe.com).
2. **Ative a opção "Test Mode"** (ou "Visualizar dados de teste") no canto superior direito (botão laranja/amarelo).
3. Vá em **Payments** (Pagamentos).
4. Você deverá ver a transação lá com status "Succeeded".

## 🔄 Resumo da Diferença

| Cenário Atual | Cenário Desejado |
|--------------|------------------|
| **Gateway**: Recurly Test Gateway | **Gateway**: Stripe (Test Mode) |
| **Onde vê o dado**: Apenas no Recurly | **Onde vê o dado**: Recurly E Stripe Dashboard |
| **Cartão**: Qualquer número fake | **Cartão**: Específico do Stripe (4242...) |
| **Stripe Status**: Invisível | **Stripe Status**: Visível em "Test Data" |

> [!TIP]
> **Dica de Debug**: Se a transação der "Success" no Recurly mas não aparecer no Stripe, verifique a seção "Transactions" no Recurly, clique na transação e procure por "Gateway Info". Se disser "Recurly Test Gateway", o roteamento ainda não está indo para o Stripe.

## Próximo Passo

Vá ao painel do Recurly agora e adicione o gateway Stripe usando as credenciais de teste (`sk_test_...`). Me avise quando fizer isso para testarmos novamente!
