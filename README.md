# Bloc
Array filtering and aggregation with a MongoDB inspired syntax.

## Usage
```js
var Bloc = require('bloc');
var data = [
  {
    id: 1,
    region: 'us-east-1'
  },
  {
    id: 2,
    region: 'us-west-1'
  }
];
var query = {
  $match: {
    region: {
      $eq: 'us-east-1'
    }
  }
};
Bloc.query(data, query).then(function(results) {
  // Results contains all items in the `us-east-1` region.
}, function(reason) {
 // Something went wrong
});
```

## Query Selectors
Below is a list of all the supported query selectors.

### $eq
Matches values that are equal to a specified value.

```js
var query = {
  $match: {
    region: {
      $eq: 'us-east-1'
    }
  }
};
```

### $ne
Matches all values that are not equal to a specified value.

```js
var query = {
  $match: {
    id: {
      $ne: 1
    }
  }
};
```

### $gt
Matches values that are greater than a specified value.

```js
var query = {
  $match: {
    id: {
      $gt: 1
    }
  }
};
```

### $gte
Matches values that are greater than or equal to a specified value.

```js
var query = {
  $match: {
    id: {
      $gte: 1
    }
  }
};
```

### $lt
Matches values that are less than a specified value.

```js
var query = {
  $match: {
    id: {
      $lt: 2
    }
  }
};
```

### $lte
Matches values that are less than or equal to a specified value.

```js
var query = {
  $match: {
    id: {
      $lte: 2
    }
  }
};
```

### $in
Matches any of the values specified in an array.

```js
var query = {
  $match: {
    id: {
      $in: [1, 2]
    }
  }
};
```

### $nin
Matches none of the values specified in an array.

```js
var query = {
  $match: {
    id: {
      $nin: [1, 2]
    }
  }
};
```

## Logical Operators
Below is a list of all of the supported logical operators.

### $or
Joins query clauses with a logical **OR** returns all documents that match the conditions of either clause.

```js
var query = {
  $match: {
    $or: [
      {
        id: {
          $eq: 1
        }
      },
      {
        region: {
          $eq: 'us-east-1'
        }
      }
    ]
  }
};
```

### $and
Joins query clauses with a logical **AND** returns all documents that match the conditions of both clauses.

```js
var query = {
  $match: {
    $and: [
      {
        id: {
          $eq: 1
        }
      },
      {
        region: {
          $eq: 'us-east-1'
        }
      }
    ]
  }
};
```

### $not
_Syntax_: `{ field: { $not: { <operator-expression> } } }`

**$not** performs a logical **NOT** operation on the specified <operator-expression> and selects 
the documents that do not match the <operator-expression>. This includes documents that 
do not contain the field.

```js
var query = {
  $match: {
    $not: {
      id: {
        $eq: 1
      }
    }
  }
};
```

### $nor
_Syntax_: `{ $nor: [ { <expression1> }, { <expression2> }, ...  { <expressionN> } ] }`

**$nor** performs a logical **NOR** operation on an array of one or more query expression and 
selects the documents that **fail** all the query expressions in the array.

```js
var query = {
  $match: {
    $nor: [
      {
        id: {
          $eq: 1
        }
      },
      {
        region: {
          $eq: 'us-east-1'
        }
      }
    ]
  }
};
```

## Element Selectors

### $exists
_Syntax_: `{ field: { $exists: <boolean> } }`

When **<boolean>** is true, **$exists** matches the documents that contain the field, including 
documents where the field value is **null**. If **<boolean>** is false, the query returns only 
the documents that do not contain the field.