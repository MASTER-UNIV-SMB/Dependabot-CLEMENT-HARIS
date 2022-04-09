package fr.harisclement.info803.utils;

import org.json.JSONObject;

public class JSONReponse {

    public static String apiReponse(boolean error, String message, JSONObject data){
        JSONObject response = new JSONObject();
        response.put("error", error);
        response.put("message", message);
        response.put("data", data);

        return response.toString();
    }

    public static String apiReponseJSON(boolean error, String message, String data){
        JSONObject response = new JSONObject();
        response.put("error", error);
        response.put("message", message);
        response.put("data", data);

        return response.toString();
    }


}
