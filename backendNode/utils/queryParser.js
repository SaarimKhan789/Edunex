function parseQueryAliases(query) {
  const aliasMap = {};

  // Extract the SELECT clause
  const selectMatch = query.match(/SELECT\s+(.+?)\s+FROM/i);
  if (!selectMatch) return aliasMap;

  const selectClause = selectMatch[1];

  // Split columns while handling complex expressions
  const columnExpressions = selectClause.split(
    /\s*,\s*(?=(?:[^']*'[^']*')*[^']*$)/
  );

  columnExpressions.forEach((expr) => {
    const aliasMatch = expr.match(/\bAS\s+["']?(\w+)["']?$/i);
    if (!aliasMatch) return;

    const alias = aliasMatch[1];
    const columnExpression = expr.replace(/\s+AS\s+["']?\w+["']?$/i, "").trim();

    aliasMap[alias] = columnExpression;
  });

  return aliasMap;
}

module.exports = { parseQueryAliases };
