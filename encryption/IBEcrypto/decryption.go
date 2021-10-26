package IBEcrypto

import (
	"encoding/hex"
	"fmt"
	"github.com/zbh888/crypto/ibe"
)

func decrypt(C ibe.Ciphertext, sk *ibe.IdentityPrivateKey) (string, error) {
	res, _ := ibe.Decrypt(sk, C)
	fmt.Println("-----> Decryption Success")
	return hex.EncodeToString(res), nil
}
