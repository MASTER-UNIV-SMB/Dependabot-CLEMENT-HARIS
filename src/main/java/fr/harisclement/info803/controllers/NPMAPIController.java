package fr.harisclement.info803.controllers;

import fr.harisclement.info803.api.NPMAPIClient;
import fr.harisclement.info803.models.PackageUpdateVerifyBody;
import fr.harisclement.info803.utils.JSONReponse;
import fr.harisclement.info803.utils.VersionCompare;
import org.json.JSONObject;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
@RestController
@RequestMapping("/api/v1/npm")
public class NPMAPIController {

    @PostMapping(path = "/verifyUpdate", produces = MediaType.APPLICATION_JSON_VALUE)
    public String read(@RequestBody PackageUpdateVerifyBody packageProvided) {
        try {
            JSONObject jsonObject = NPMAPIClient.searchAPI(packageProvided.getName());

            VersionCompare versionProvided = new VersionCompare(packageProvided.getVersion());
            VersionCompare versionUpdated = new VersionCompare(jsonObject.getString("version"));

            boolean isUpdateAvailable = versionProvided.compareTo(versionUpdated) < 0;

            JSONObject data = new JSONObject();
            data.put("name", jsonObject.getString("name"));
            data.put("version", packageProvided.getVersion());
            data.put("isUpdateAvailable", isUpdateAvailable);
            if (isUpdateAvailable) {
                data.put("nextVersion", jsonObject.getString("version"));
            }else{
                data.put("nextVersion", "/");
            }
            data.put("isLoading", false);
            data.put("isError", false);

            return JSONReponse.apiReponse(false, "Ok", data);
        } catch (Exception e) {
            JSONObject data = new JSONObject();
            data.put("name", packageProvided.getName());
            data.put("version", packageProvided.getVersion());
            data.put("isUpdateAvailable", false);
            data.put("nextVersion", "/");
            data.put("isLoading", false);
            data.put("isError", false);

            return JSONReponse.apiReponse(false, "Ok", data);
        }
    }

}
