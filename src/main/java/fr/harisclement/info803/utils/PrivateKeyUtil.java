package fr.harisclement.info803.utils;

import org.springframework.core.io.ClassPathResource;

import java.io.File;
import java.nio.file.Files;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;

public class PrivateKeyUtil {

    public static PrivateKey get(String filename) throws Exception {
        File resource = new ClassPathResource(filename).getFile();
        byte[] keyBytes = Files.readAllBytes(resource.toPath());

        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        return kf.generatePrivate(spec);
    }
}
