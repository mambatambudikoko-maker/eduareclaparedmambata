export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  var prompt = req.body.prompt;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Le texte de description est vide.' });
  }

  if (prompt.length > 2500) {
    return res.status(400).json({ error: 'Le texte est trop long (max 2500 caractères).' });
  }

  var apiKey = process.env.KIE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Configuration serveur manquante (clé API absente).' });
  }

  try {
    var response = await fetch('https://api.kie.ai/api/v1/jobs/createTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: 'kling-3-0',
        input: {
          prompt: prompt,
          duration: 10,
          aspect_ratio: '9:16',
          mode: 'std',
          sound: true
        }
      })
    });

    var data = await response.json();

    if (!response.ok || data.code !== 200) {
      return res.status(502).json({ error: data.msg || 'Erreur lors de la génération.' });
    }

    return res.status(200).json({ taskId: data.data.taskId });

  } catch (err) {
    return res.status(500).json({ error: 'Erreur de connexion au service de génération.' });
  }
}
api.kie.ai
api.kie.ai
Drk mam'ss
export default async function handler(req, res) {
  var taskId = req.query.taskId;

  if (!taskId) {
    return res.status(400).json({ error: 'taskId manquant' });
  }

  var apiKey = process.env.KIE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Configuration serveur manquante (clé API absente).' });
  }

  try {
    var response = await fetch('https://api.kie.ai/api/v1/jobs/recordInfo?taskId=' + taskId, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + apiKey
      }
    });

    var data = await response.json();

    if (!response.ok || data.code !== 200) {
      return res.status(502).json({ status: 'failed', error: data.msg || 'Erreur de statut' });
    }

    var state = data.data.state;

    if (state === 'success') {
      var videoUrl = null;
      if (data.data.resultJson) {
        var parsed = JSON.parse(data.data.resultJson);
        if (parsed.resultUrls && parsed.resultUrls.length > 0) {
          videoUrl = parsed.resultUrls[0];
        }
      }
      return res.status(200).json({ status: 'success', videoUrl: videoUrl });
    } else if (state === 'fail') {
      return res.status(200).json({ status: 'failed' });
    } else {
      return res.status(200).json({ status: 'pending' });
    }

  } catch (err) {
    return res.status(500).json({ status: 'failed', error: 'Erreur de connexion.' });
  }
}
api.kie.ai
api.kie.ai
Rédiger
