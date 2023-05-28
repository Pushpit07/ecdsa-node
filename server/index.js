const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
	"0478ec7984529791d34fb59f0e46a930791c0a6de65a51016757f9b12bc9cd52ef8b9f85fee8798bf50083c145767acfac128bf81d24a903246f4ff08c5eb8d8d1": 100,
	"04f7e897b281badabbba3713142d949f2a579c7423969244a4ba58de760d7469fb26ba7bf90c81d435965dfec564e06524ac5a4e672e7fafa4c17fee7596e1b9cc": 50,
	"04eb0e077658b6f39ac5bbbf5ced4e719005e0dbae507e0b51b18b64ff9b730678c58a59c009228f5fbad215392eed7b02c9aa1e1ea07c5625a1451d419d0198ab": 75,
};

app.get("/balance/:address", (req, res) => {
	const { address } = req.params;
	const balance = balances[address] || 0;
	res.send({ balance });
});

app.post("/send", (req, res) => {
	const { sender, recipient, amount } = req.body;

	setInitialBalance(sender);
	setInitialBalance(recipient);

	if (balances[sender] < amount) {
		res.status(400).send({ message: "Not enough funds!" });
	} else {
		balances[sender] -= amount;
		balances[recipient] += amount;
		res.send({ balance: balances[sender] });
	}
});

app.listen(port, () => {
	console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
	if (!balances[address]) {
		balances[address] = 0;
	}
}
