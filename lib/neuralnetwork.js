
class ActivationFunction {
  constructor(func, dfunc) {
    this.func = func;
    this.dfunc = dfunc;
  }
}

let sigmoid = new ActivationFunction(
  x => 1 / (1 + Math.exp(-x)),
  y => y * (1 - y)
);

let tanh = new ActivationFunction(
  x => Math.tanh(x),
  y => 1 - (y * y)
);


class NeuralNetwork {
  constructor(input_N, hidden_N, output_N) {

    if (input_N instanceof NeuralNetwork) {
      let ref = input_N;
      this.input_nodes = ref.input_nodes;
      this.hidden_nodes = ref.hidden_nodes;
      this.output_nodes = ref.output_nodes;

      this.weights_ihidden = ref.weights_ihidden.copy();
      this.weights_houtput = ref.weights_houtput.copy();

      this.bias_hidden = ref.bias_hidden.copy();
      this.bias_output = ref.bias_output.copy();
    } else {
      this.input_nodes = input_N;
      this.hidden_nodes = hidden_N;
      this.output_nodes =output_N;

      this.weights_ihidden = new Matrix(this.hidden_nodes, this.input_nodes);
      this.weights_houtput = new Matrix(this.output_nodes, this.hidden_nodes);
      this.weights_ihidden.randomize();
      this.weights_houtput.randomize();

      this.bias_hidden = new Matrix(this.hidden_nodes, 1);
      this.bias_output = new Matrix(this.output_nodes, 1);
      this.bias_hidden.randomize();
      this.bias_output.randomize();
    }

    this.setActivationFunc(tanh);
  }

  prediction(input_array) {
    let inputs = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ihidden, inputs);
    hidden.add(this.bias_hidden);
    hidden.map(this.activation_function.func);

    let output = Matrix.multiply(this.weights_houtput, hidden);
    output.add(this.bias_output);
    output.map(this.activation_function.func);

    return output.toArray();
  }

  mutate(func) {
    this.weights_ihidden.map(func);
    this.weights_houtput.map(func);
    this.bias_hidden.map(func);
    this.bias_output.map(func);
  }

  setActivationFunc(func = sigmoid) {
    this.activation_function = func;
  }

  copy() {
    return new NeuralNetwork(this);
  }
}
