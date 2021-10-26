package IBEcrypto

import (
	"encoding/hex"
	"errors"
	"fmt"
	"github.com/zbh888/crypto/ibe"
	"vuvuzela.io/crypto/rand"
)

func encrypt(message string, pk *ibe.MasterPublicKey, ID string) (ibe.Ciphertext, error) {
	fmt.Println("-----> Encryption part")
	var C ibe.Ciphertext
	messageBytes, err := hex.DecodeString(message)
	if err != nil {
		return C, errors.New("hex decoding fails")
	}
	fmt.Println("-----> Message encoded")
	C = ibe.Encrypt(rand.Reader, pk, []byte(ID), messageBytes)
	fmt.Println("Encryption Success")
	return C, nil
}
