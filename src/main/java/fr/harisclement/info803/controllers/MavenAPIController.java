package fr.harisclement.info803.controllers;

import fr.harisclement.info803.api.MavenCentralAPIClient;
import fr.harisclement.info803.models.PackageUpdateVerifyBody;
import fr.harisclement.info803.utils.JSONReponse;
import fr.harisclement.info803.utils.VersionCompare;
import org.json.JSONObject;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
@RestController
@RequestMapping("/api/v1/maven")
public class MavenAPIController {

    @PostMapping(path = "/verifyUpdate", produces = MediaType.APPLICATION_JSON_VALUE)
    public String read(@RequestBody PackageUpdateVerifyBody packageUpdateVerifyBody) {
        try {
            JSONObject jsonObject = MavenCentralAPIClient.searchAPI(packageUpdateVerifyBody.getName());

            VersionCompare versionProvided = new VersionCompare(packageUpdateVerifyBody.getVersion());
            VersionCompare versionUpdated = new VersionCompare(jsonObject.getString("latestVersion"));

            boolean isUpdateAvailable = versionProvided.compareTo(versionUpdated) < 0;

            JSONObject data = new JSONObject();
            data.put("groupId", jsonObject.getString("g"));
            data.put("version", packageUpdateVerifyBody.getVersion());
            data.put("isUpdateAvailable", isUpdateAvailable);
            if (isUpdateAvailable) {
                data.put("nextVersion", jsonObject.getString("latestVersion"));
            }else{
                data.put("nextVersion", "/");
            }
            data.put("isLoading", false);
            data.put("isError", false);

            return JSONReponse.apiReponse(false, "Ok", data);
        } catch (Exception e) {
            JSONObject data = new JSONObject();

            data.put("groupId", packageUpdateVerifyBody.getName());
            data.put("version", packageUpdateVerifyBody.getVersion());
            data.put("isUpdateAvailable", false);
            data.put("nextVersion", "/");
            data.put("isLoading", false);
            data.put("isError", false);

            return JSONReponse.apiReponse(true, e.getMessage(), null);
        }
    }

}
