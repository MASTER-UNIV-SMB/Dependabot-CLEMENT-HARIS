package fr.harisclement.info803.controllers;

import com.github.kevinsawicki.http.HttpRequest;
import fr.harisclement.info803.utils.JSONReponse;
import fr.harisclement.info803.utils.JsonReader;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/api/v1/github")
public class GitHubAPIController {

    @Value("${github.client_id}")
    private String client_id;

    @Value("${github.client_secret}")
    private String client_secret;

    @Value("${github.redirect_uri}")
    private String redirect_uri;

    @GetMapping(path = "/access-token", produces = MediaType.APPLICATION_JSON_VALUE)
    public String accessToken(@RequestParam String code) {
        try {
            Map<String, String> bodyParams = new HashMap<>();
            bodyParams.put("client_id", client_id);
            bodyParams.put("client_secret", client_secret);
            bodyParams.put("code", code);
            bodyParams.put("redirect_uri", redirect_uri);

            HttpRequest request = HttpRequest.post("https://github.com/login/oauth/access_token").acceptJson().contentType("application/json").form(bodyParams);
            int statusCode = request.code();
            if(statusCode != 200) throw new Exception("Une erreur s'est produite pendant la validation de votre code !");

            JSONObject responseJSON = new JSONObject(request.body());

            return JSONReponse.apiReponse(false, "Ok", responseJSON);
        } catch (Exception e) {
            e.printStackTrace();
            return JSONReponse.apiReponse(true, e.getMessage(), null);
        }
    }

    @GetMapping(path = "/repositories", produces = MediaType.APPLICATION_JSON_VALUE)
    public String repositories(@RequestParam String oauthToken, @RequestParam String searchRepo) {
        try {
            Map<String, String> bodyParams = new HashMap<>();

            HttpRequest request = HttpRequest.get("https://api.github.com/user/repos?direction=asc").acceptJson().contentType("application/json").header("Authorization", "token " + oauthToken);
            int statusCode = request.code();
            if(statusCode != 200) throw new Exception("Une erreur s'est produite pendant la validation de votre code !");

            String response = request.body();

            return JSONReponse.apiReponseJSON(false, "Ok", response);
        } catch (Exception e) {
            e.printStackTrace();
            return JSONReponse.apiReponse(true, e.getMessage(), null);
        }
    }

    @GetMapping(path = "/repositories/file", produces = MediaType.APPLICATION_JSON_VALUE)
    public String repositories(@RequestParam String oauthToken, @RequestParam String owner, @RequestParam String repo, @RequestParam String file) {
        try {
            Map<String, String> bodyParams = new HashMap<>();

            HttpRequest request = HttpRequest.get("https://api.github.com/repos/" + owner + "/" + repo + "/contents/" + file).acceptJson().contentType("application/json").header("Authorization", "token " + oauthToken);
            int statusCode = request.code();
            if(statusCode != 200) throw new Exception("Une erreur s'est produite pendant la récupération de votre code !");

            String response = request.body();

            JSONObject jsonObject = new JSONObject(response);

            if(file.equals("package.json")){
                JSONObject packageJSONContent = JsonReader.readJsonFromUrl(jsonObject.getString("download_url"));
                jsonObject.put("fileContent", packageJSONContent);
            }else{
                String packageJSONContent = JsonReader.readStringFromUrl(jsonObject.getString("download_url"));
                jsonObject.put("fileContent", packageJSONContent);
            }

            return JSONReponse.apiReponse(false, "Ok", jsonObject);
        } catch (Exception e) {
            e.printStackTrace();
            return JSONReponse.apiReponse(true, e.getMessage(), null);
        }
    }

}
