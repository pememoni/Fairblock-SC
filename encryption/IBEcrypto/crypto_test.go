package IBEcrypto

import (
	"github.com/pememoni/crypto/ibe"
	"math/big"
	"reflect"
	"testing"
	"vuvuzela.io/crypto/bn256"
	"vuvuzela.io/crypto/rand"
)

func Test(t *testing.T) {
	// Key Generation, private key is not master secret
	PK,secret := ibe.Setup(rand.Reader)
	message := "000000000000000000000000000000000000000000000000000000000000004000000000000000000000000037f20d96a0ed94e7ae25661ffdcb00155b27ca4d0000000000000000000000000000000000000000000000000000000000000002c0de000000000000000000000000000000000000000000000000000000000000"
	ID := "3000"
	SK := ibe.Extract(secret, []byte(ID))
	// Encryption
	Cipher, err := encrypt(message, PK, ID)
	if err != nil {
		t.Error(err)
	}
	m, err := decrypt(Cipher, SK)
	if err != nil {
		t.Error(err)
	}
	if !reflect.DeepEqual(message, m) {
		t.Error("Not equal")
	}
}

func f(x int64) *big.Int {
	return big.NewInt( 1234 + 166*x + 94*x*x)
}

// threshold 3, player 3, all honest
// These tests are built based on they already run shamir secret sharing
// So the secret is 1234, and they have their shares, the threshold is 3
func Test2(t *testing.T) {
	index2Share := f(2)
	index4Share := f(4)
	index5Share := f(5)
	S := []uint32{2,4,5}
	secret := big.NewInt(0)
	index2Share.Mul(lagrangeCoefficient(2,S), index2Share)
	index4Share.Mul(lagrangeCoefficient(4,S), index4Share)
	index5Share.Mul(lagrangeCoefficient(5,S), index5Share)
	secret.Add(secret, index2Share)
	secret.Add(secret, index4Share)
	secret.Add(secret, index5Share)
	secret.Mod(secret, bn256.Order)
	// Secret has been recovered which is 1234
	if secret.Cmp(big.NewInt(1234)) != 0 {
		t.Error("fail to give secret")
	}
	// For now, player 2,4,5 have their shares. They are going to process the share and submit the processed key share
	// In vuvuzela.io/crypto/ibe they choose to encrypt using the base generator of G1. So for testing purpose
	// This P can not be random, but it shouldn't affect the security since the secret is unknown
	index2Share = f(2)
	index4Share = f(4)
	index5Share = f(5)
	P := new(bn256.G1).ScalarBaseMult(big.NewInt(1))
	c2 := generateCommitment(index2Share, P, 2)
	c4 := generateCommitment(index4Share, P, 4)
	c5 := generateCommitment(index5Share, P, 5)
	PK := AggregationPK([]Commitment{c2,c4,c5},S)
	message := "000000000000000000000000000000000000000000000000000000000000004000000000000000000000000037f20d96a0ed94e7ae25661ffdcb00155b27ca4d0000000000000000000000000000000000000000000000000000000000000002c0de000000000000000000000000000000000000000000000000000000000000"
	ID := "3001"
	// Then they want to send the processed share
	s2 := SecretShareProcess(index2Share,ID,2)
	s4 := SecretShareProcess(index4Share,ID,4)
	s5 := SecretShareProcess(index5Share,ID,5)
	Cipher, _ := encrypt(message, PK, ID)

	SK,_ := AggregationSK([]SentShare{s2,s4,s5}, []Commitment{c2,c4,c5}, ID, S)
	m, _ := decrypt(Cipher, SK)
	if !reflect.DeepEqual(message, m) {
		t.Error("Not equal")
	}
}

// less than 3
func Test3(t *testing.T) {
	index2Share := f(2)
	index4Share := f(4)
	index5Share := f(5)
	S := []uint32{2,4,5}
	secret := big.NewInt(0)
	index2Share.Mul(lagrangeCoefficient(2,S), index2Share)
	index4Share.Mul(lagrangeCoefficient(4,S), index4Share)
	index5Share.Mul(lagrangeCoefficient(5,S), index5Share)
	secret.Add(secret, index2Share)
	secret.Add(secret, index4Share)
	secret.Add(secret, index5Share)
	secret.Mod(secret, bn256.Order)
	// Secret has been recovered which is 1234
	if secret.Cmp(big.NewInt(1234)) != 0 {
		t.Error("fail to give secret")
	}
	// For now, player 2,4,5 have their shares. They are going to process the share and submit the processed key share
	// In vuvuzela.io/crypto/ibe they choose to encrypt using the base generator of G1. So for testing purpose
	// This P can not be random, but it shouldn't affect the security since the secret is unknown
	index2Share = f(2)
	index4Share = f(4)
	index5Share = f(5)
	P := new(bn256.G1).ScalarBaseMult(big.NewInt(1))
	c2 := generateCommitment(index2Share, P, 2)
	c4 := generateCommitment(index4Share, P, 4)
	c5 := generateCommitment(index5Share, P, 5)
	PK := AggregationPK([]Commitment{c2,c4,c5},S)
	message := "000000000000000000000000000000000000000000000000000000000000004000000000000000000000000037f20d96a0ed94e7ae25661ffdcb00155b27ca4d0000000000000000000000000000000000000000000000000000000000000002c0de000000000000000000000000000000000000000000000000000000000000"
	ID := "3000"
	// Then they want to send the processed share
	s2 := SecretShareProcess(index2Share,ID,2)
	s4 := SecretShareProcess(index4Share,ID,4)
	Cipher, _ := encrypt(message, PK, ID)

	SK,_ := AggregationSK([]SentShare{s2,s4}, []Commitment{c2,c4}, ID, S)
	m, _ := decrypt(Cipher, SK)
	if reflect.DeepEqual(message, m) {
		t.Error("Should be not equal")
	}
}

// Five keypers in total, threshold = 3, 4 of them participated in decryption
func Test_demo(t *testing.T) {
	//=============================== After VSS ================================
	// 1234 + 166*x*x + 94*x*x, so master secret is 1234
	// After VSS, they will have their secret shares, which are scalars
	index1Share := f(1)
	index2Share := f(2)
	index3Share := f(3)
	index4Share := f(4)
	index5Share := f(5)

	// P is the base of G1
	P := new(bn256.G1).ScalarBaseMult(big.NewInt(1))
	// Also after VSS, commitments are public to every one
	c1 := generateCommitment(index1Share, P, 1)
	c2 := generateCommitment(index2Share, P, 2)
	c3 := generateCommitment(index3Share, P, 3)
	c4 := generateCommitment(index4Share, P, 4)
	c5 := generateCommitment(index5Share, P, 5)
	// So they could simply public the public key by aggregating commitments
	// Then users are able to use this key for encryption
	PK := AggregationPK([]Commitment{c1,c2,c3,c4,c5},[]uint32{1,2,3,4,5})

	//=============================== From User view ================================
	// The message: string in hex
	// ID         : Any string but in this setting, should be a specific block number
	// Cipher     : A special structure
	message := "000000000000000000000000000000000000000000000000000000000000004000000000000000000000000037f20d96a0ed94e7ae25661ffdcb00155b27ca4d0000000000000000000000000000000000000000000000000000000000000002c0de000000000000000000000000000000000000000000000000000000000000"
	ID_round1 := "3000"
	ID_round2 := "4000"
 	Cipher_round1, _ := encrypt(message, PK, ID_round1)
	Cipher_round1_byte,_ := Cipher_round1.MarshalBinary()
	Cipher_round2, _ := encrypt(message, PK, ID_round2)
	Cipher_round2_byte,_ := Cipher_round2.MarshalBinary()

	if reflect.DeepEqual(Cipher_round1_byte, Cipher_round2_byte) {
		t.Error("Should noy be equal")
	}
	// After encryption, user should be able to send Cipher byte to `Commitment Contract`

	//=============================== From Keypers view ================================
	// Keypers could generate the key any time even before the block is mined
	// Then they want to send the processed share

	// FIRST ROUND: ID is 3000,
	// index 3 is not involved
	s1_round1 := SecretShareProcess(index1Share,ID_round1,1)
	s2_round1 := SecretShareProcess(index2Share,ID_round1,2)
	_          = SecretShareProcess(index3Share,ID_round1,3)
	s4_round1 := SecretShareProcess(index4Share,ID_round1,4)
	s5_round1 := SecretShareProcess(index5Share,ID_round1,5)

	// SECOND ROUND: ID is 3001,
	// index 1 is not involved, index 3 is malicious
	_          = SecretShareProcess(index1Share,ID_round2,1)
	s2_round2 := SecretShareProcess(index2Share,ID_round2,2)
	// Wrong share, and sent
	s3_round2 := SecretShareProcess(big.NewInt(3),ID_round2,3)
	s4_round2 := SecretShareProcess(index4Share,ID_round2,4)
	s5_round2 := SecretShareProcess(index5Share,ID_round2,5)

	// Key generation
	SK_round1,_ := AggregationSK(
		[]SentShare{s1_round1,s2_round1,s4_round1,s5_round1},
		[]Commitment{c1,c2,c4,c5}, ID_round1,
		[]uint32{1,2,4,5}) // Keypers involved
	SK_round2, Invalid := AggregationSK(
		[]SentShare{s2_round2,s3_round2,s4_round2,s5_round2},
		[]Commitment{c2,c3,c4,c5}, ID_round2,
		[]uint32{2,3,4,5}) // Keypers involved
	if !reflect.DeepEqual(Invalid, []uint32{3}) {
		t.Error("The malicious user is 3")
	}

	// Keypers picks the ciphertext from commitment contract, and decrypt it
	Received_Cipher_round1 := new(ibe.Ciphertext)
	_ = Received_Cipher_round1.UnmarshalBinary(Cipher_round1_byte)
	Received_Cipher_round2 := new(ibe.Ciphertext)
	_ = Received_Cipher_round2.UnmarshalBinary(Cipher_round2_byte)

	// The decryption happens here
	m1, _ := decrypt(*Received_Cipher_round1, SK_round1)
	m2, _ := decrypt(*Received_Cipher_round2, SK_round2)
	if !reflect.DeepEqual(message, m2) {
		t.Error("Should be equal")
	}
	if !reflect.DeepEqual(message, m1) {
		t.Error("Should be equal")
	}
}


