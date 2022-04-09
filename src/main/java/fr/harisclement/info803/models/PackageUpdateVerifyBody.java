package fr.harisclement.info803.models;

public class PackageUpdateVerifyBody {

    private String name;
    private String version;
    private String githubOAuthToken;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getGithubOAuthToken() {
        return githubOAuthToken;
    }

    public void setGithubOAuthToken(String githubOAuthToken) {
        this.githubOAuthToken = githubOAuthToken;
    }
}
